import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma";

export async function getUsers(tenantId: string) {
    return prisma.user.findMany({
        where: { tenantId, },
        orderBy: { createdAt: "asc", },
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