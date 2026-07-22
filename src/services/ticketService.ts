import { Prisma, TicketPriority, TicketSentiment, TicketStatus } from "../../generated/prisma";
import { prisma } from "../lib/prisma";
import { analyzeTicket } from "./aiService";

export async function createTicket(tenantId: string, createdById: string, title: string, rawText: string, attachmentUrl?: string) {
    const analysis = await analyzeTicket(
        title,
        rawText
    );

    return prisma.ticket.create({
        data: {
            tenantId,
            createdById,
            title,
            rawText,
            attachmentUrl,
            status: TicketStatus.OPEN,
            priority: analysis.priority as TicketPriority,
            sentiment: analysis.sentiment as TicketSentiment,
        }
    });
}

export async function getTickets(tenantId: string, userId: string, role: string) {
    if (role === "USER") {
        return prisma.ticket.findMany({
            where: { tenantId, createdById: userId, },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc", },
        });
    }

    return prisma.ticket.findMany({
        where: { tenantId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function getTicket(tenantId: string, userId: string, role: string, ticketId: string) {
    if (role === "USER") {
        return prisma.ticket.findFirst({
            where: {
                id: ticketId,
                tenantId,
                createdById: userId,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    return prisma.ticket.findFirst({
        where: {
            id: ticketId,
            tenantId
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
}

export async function updateTicket(tenantId: string, userId: string, role: string, ticketId: string, data: Prisma.TicketUpdateInput) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            tenantId
        }
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (role === "USER" && ticket.createdById !== userId) {
        throw new Error("Forbidden");
    }

    return prisma.ticket.update({
        where: { id: ticketId },
        data
    });
}

export async function deleteTicket(tenantId: string, userId: string, role: string, ticketId: string) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            tenantId
        }
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (role === "USER" && ticket.createdById !== userId) {
        throw new Error("Forbidden");
    }

    return prisma.ticket.delete({
        where: { id: ticketId }
    });
}