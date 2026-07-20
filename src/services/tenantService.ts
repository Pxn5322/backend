import { prisma } from "../lib/prisma";

export async function getTenants() {
    return prisma.tenant.findMany({
        include: {
            _count: {
                select: {
                    users: true,
                    tickets: true,
                },
            },
        },
        orderBy: { companyName: "asc", },
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

export async function createTenant(companyName: string) {
    return prisma.tenant.create({
        data: { companyName, },
    });
}

export async function updateTenant(id: string, companyName: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { id },
    });

    if (!tenant) {
        throw new Error("Tenant not found");
    }

    return prisma.tenant.update({
        where: { id },
        data: { companyName, },
    });
}

export async function deleteTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { id },
    });

    if (!tenant) {
        throw new Error("Tenant not found");
    }

    return prisma.tenant.delete({
        where: { id },
    });
}