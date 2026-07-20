import { TicketPriority, TicketStatus, } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export async function getDashboardStats(tenantId: string) {
    const [
        totalTickets,
        openTickets,
        progressTickets,
        resolvedTickets,
        highPriorityTickets,
        criticalPriorityTickets,
        knowledgeCount,
        recentTickets,
    ] = await Promise.all([
        prisma.ticket.count({ where: { tenantId }, }),

        prisma.ticket.count({
            where: { tenantId, status: TicketStatus.OPEN, },
        }),

        prisma.ticket.count({
            where: { tenantId, status: TicketStatus.IN_PROGRESS, },
        }),

        prisma.ticket.count({
            where: { tenantId, status: TicketStatus.RESOLVED, },
        }),

        prisma.ticket.count({
            where: { tenantId, priority: TicketPriority.HIGH }
        }),

        prisma.ticket.count({
            where: { tenantId, priority: TicketPriority.CRITICAL }
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
        highPriorityTickets,
        criticalPriorityTickets,
        knowledgeCount,
        recentTickets,
    };
}