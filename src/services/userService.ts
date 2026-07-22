import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma";
import { adminAuth } from "../config/firebaseAdmin";

export async function getTenantUsers(role: UserRole, tenantId: string) {
    return prisma.user.findMany({
        where: { tenantId, },
        include: { tenant: true, },
        orderBy: { createdAt: "asc", },
    });
}

export async function getTenantUser(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId, },
    });
}

export async function updateTenantUser(tenantId: string, id: string, data: { name: string; email: string; role: UserRole; }) {
    const user = await prisma.user.findUnique({
        where: { id, },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const duplicated = await prisma.user.findFirst({
        where: {
            email: data.email,
            NOT: { id, },
        },
    });

    if (duplicated) {
        throw new Error("Email already exists.");
    }

    await adminAuth.updateUser(id, {
        email: data.email,
        displayName: data.name,
    });

    return prisma.user.update({
        where: { id, },
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
        },
        include: { tenant: true, },
    });
}