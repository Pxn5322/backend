import { UserRole } from "../../generated/prisma";
import { prisma } from "../lib/prisma";
import { RegisterRequest } from "../types/register";

export async function registerUser(data: RegisterRequest) {
    const tenant = await prisma.tenant.findUnique({
        where: { companyCode: data.companyCode, },
    });

    if (!tenant) {
        throw new Error("Company not found");
    }

    const existing = await prisma.user.findUnique({
        where: { id: data.uid, },
    });

    if (existing) {
        return existing;
    }

    return prisma.user.create({
        data: {
            id: data.uid,
            name: data.name,
            email: data.email,
            tenantId: tenant.id,
            role: UserRole.USER,
        },
    });
}

export async function getCurrentUser(uid: string) {
    return prisma.user.findUnique({
        where: {
            id: uid,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            tenantId: true,
            createdAt: true,
        },
    });
}