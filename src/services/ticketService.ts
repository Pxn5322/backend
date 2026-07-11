import { Prisma, TicketPriority, TicketSentiment, TicketStatus } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export async function createTicket(tenantId: string, title: string, rawText: string) {
    return prisma.ticket.create({
        data: {
            tenantId,
            title,
            rawText,
            status: TicketStatus.OPEN,
            priority: TicketPriority.PENDING,
            sentiment: TicketSentiment.NEUTRAL
        }
    });
}

export async function getTickets(tenantId: string) {
    return prisma.ticket.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" }
    });
}

export async function getTicket(tenantId: string, ticketId: string) {
    return prisma.ticket.findFirst({
        where: {
            id: ticketId,
            tenantId
        }
    });
}

export async function updateTicket(tenantId: string, ticketId: string, data: Prisma.TicketUpdateInput) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            tenantId
        }
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    return prisma.ticket.update({
        where: { id: ticketId },
        data
    });
}

export async function deleteTicket(tenantId: string, ticketId: string) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            tenantId
        }
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    return prisma.ticket.delete({
        where: { id: ticketId }
    });
}