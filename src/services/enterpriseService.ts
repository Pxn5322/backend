import { prisma } from "../lib/prisma";

export async function getDashboardStats() {
    const [
        companies,
        users,
        tickets,
        knowledge,
    ] = await Promise.all([
        prisma.tenant.count(),
        prisma.user.count(),
        prisma.ticket.count(),
        prisma.knowledgeBase.count(),
    ]);

    return {
        companies,
        users,
        tickets,
        knowledge,
    };
}