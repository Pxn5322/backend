import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const getTickets = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { tenantId: req.user!.tenantId, },
            orderBy: { createdAt: "desc", },
        });

        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tickets", });
    }
};

export const createTicket = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, rawText } = req.body;

        const ticket = await prisma.ticket.create({
            data: {
                title,
                rawText,
                tenantId: req.user!.tenantId,
            },
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create ticket", });
    }
};

export const updateTicket = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.ticket.findFirst({
            where: {
                id,
                tenantId: req.user!.tenantId,
            },
        });

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found", });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id, },
            data: req.body,
        });

        res.json(updatedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update ticket", });
    }
};

export const deleteTicket = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify the ticket belongs to the current tenant
        const ticket = await prisma.ticket.findFirst({
            where: {
                id,
                tenantId: req.user!.tenantId,
            },
        });

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found", });
        }

        await prisma.ticket.delete({
            where: { id, },
        });

        res.json({ message: "Ticket deleted successfully", });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete ticket", });
    }
};