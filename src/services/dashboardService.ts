import { prisma } from "../lib/prisma";

export async function getDashboardStats(tenantId: string) {
    const [
        totalTickets,
        openTickets,
        progressTickets,
        resolvedTickets,
        knowledgeCount,
        recentTickets,
    ] = await Promise.all([
        prisma.ticket.count({ where: { tenantId }, }),

        prisma.ticket.count({
            where: { tenantId, status: "OPEN", },
        }),

        prisma.ticket.count({
            where: { tenantId, status: "IN_PROGRESS", },
        }),

        prisma.ticket.count({
            where: { tenantId, status: "RESOLVED", },
        }),

        prisma.knowledgeBase.count({
            where: { tenantId },
        }),

        prisma.ticket.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc", },
            take: 5,
        }),
    ]);

    return {
        totalTickets,
        openTickets,
        progressTickets,
        resolvedTickets,
        knowledgeCount,
        recentTickets,
    };
}