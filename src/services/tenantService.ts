import { UserRole } from "../../generated/prisma";
import { adminAuth } from "../config/firebaseAdmin";
import { prisma } from "../lib/prisma";
import { CompanyRegistrationRequest } from "../types/companyRegistration";

export async function getCompanies() {
    return prisma.tenant.findMany({
        orderBy: { createdAt: "desc", },
        include: {
            users: true,
            _count: {
                select: {
                    users: true,
                    tickets: true,
                },
            },
        },
    });
}

export async function getTenant(id: string) {
    return prisma.tenant.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    users: true,
                    tickets: true,
                },
            },
        },
    });
}

export async function registerCompany(data: CompanyRegistrationRequest) {
    const existingTenant = await prisma.tenant.findUnique({
        where: { companyCode: data.companyCode, },
    });

    if (existingTenant) {
        throw new Error("Company code already exists.");
    }

    const firebaseUser = await adminAuth.createUser({
        email: data.adminEmail,
        password: data.adminPassword,
        displayName: data.adminName,
    });

    try {
        return await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    companyName: data.companyName,
                    companyCode: data.companyCode,
                },
            });

            const user = await tx.user.create({
                data: {
                    id: firebaseUser.uid,
                    name: data.adminName,
                    email: data.adminEmail,
                    role: UserRole.ADMIN,
                    tenantId: tenant.id,
                },
            });

            return await tx.tenant.findUnique({
                where: { id: tenant.id },
                include: {
                    _count: {
                        select: {
                            users: true,
                            tickets: true
                        }
                    }
                }
            });
        });
    } catch (error) {
        await adminAuth.deleteUser(firebaseUser.uid);
        throw error;
    }
}

export async function updateTenant(id: string, companyName: string, companyCode: string) {
    const existing = await prisma.tenant.findFirst({
        where: {
            companyCode,
            NOT: { id, }
        }
    });

    if (existing) {
        throw new Error("Company code already exists")
    }

    const tenant = await prisma.tenant.findUnique({
        where: { id },
    });

    if (!tenant) {
        throw new Error("Tenant not found");
    }

    if (tenant.companyCode === "ENTERPRISE") {
        throw new Error("Enterprise company cannot be modified.");
    }

    return prisma.tenant.update({
        where: { id },
        data: { companyName, companyCode, },
    });
}

export async function deleteTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { id },
    });

    if (!tenant) {
        throw new Error("Tenant not found");
    }

    // Prevent deleting Enterprise company
    if (tenant.companyCode === "ENTERPRISE") {
        throw new Error("Enterprise company cannot be deleted.");
    }

    // Retrieve all users
    const users = await prisma.user.findMany({
        where: { tenantId: id, },
    });

    // Delete Firebase Authentication users
    for (const user of users) {
        try {
            await adminAuth.deleteUser(user.id);
        } catch (error) {
            console.error(`Unable to delete Firebase user ${user.email}`, error);
        }
    }

    return prisma.$transaction(async (tx) => {
        await tx.ticket.deleteMany({ where: { tenantId: id, }, });
        await tx.knowledgeBase.deleteMany({ where: { tenantId: id, }, });
        await tx.user.deleteMany({ where: { tenantId: id, }, });

        return tx.tenant.delete({ where: { id, }, });
    });
}