import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma";

export async function getUsers(role: UserRole, tenantId: string) {
    if (role === UserRole.ENTERPRISE) {
        return prisma.user.findMany({
            include: { tenant: true, },
            orderBy: { createdAt: "asc", },
        });
    }

    return prisma.user.findMany({
        where: { tenantId, },
        include: { tenant: true, },
        orderBy: { createdAt: "asc", },
    });
}

export async function getUser(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId, },
    });
}

export async function updateUserRole(tenantId: string, id: string, role: UserRole) {
    const user = await prisma.user.findFirst({
        where: { id, tenantId, },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return prisma.user.update({
        where: { id, },
        data: { role, },
    });
}