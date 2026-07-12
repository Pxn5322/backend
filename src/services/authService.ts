import { prisma } from "../lib/prisma";

export async function getCurrentUser(uid: string) {
    return prisma.user.findUnique({
        where: {
            id: uid,
        },
        select: {
            id: true,
            email: true,
            role: true,
            tenantId: true,
            createdAt: true,
        },
    });
}