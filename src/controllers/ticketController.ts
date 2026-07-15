import { Response } from "express";
import * as ticketService from "../services/ticketService";
import { AuthRequest } from "../middleware/authenticate";

export const getTickets = async (req: AuthRequest, res: Response) => {
    try {
        const tickets = await ticketService.getTickets(
            req.user!.tenantId
        );

        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tickets", });
    }
};

export async function getTicket(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const ticket = await ticketService.getTicket(
            req.user!.tenantId,
            id
        );

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tickets", });
    }
}

export const createTicket = async (req: AuthRequest, res: Response) => {
    try {
        const { title, rawText } = req.body;

        const ticket = await ticketService.createTicket(
            req.user!.tenantId,
            title,
            rawText
        );

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create ticket", });
    }
};

export const updateTicket = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;

        const ticket = await ticketService.updateTicket(
            req.user!.tenantId,
            id,
            req.body
        );

        res.json(ticket);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            if (error.message === "Ticket not found") {
                return res.status(404).json({ message: error.message });
            }
        }

        res.status(500).json({ error: "Failed to update ticket", });
    }
};

export const deleteTicket = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;

        await ticketService.deleteTicket(
            req.user!.tenantId,
            id
        );

        res.json({ message: "Ticket deleted successfully", });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            if (error.message === "Ticket not found") {
                return res.status(404).json({ message: error.message });
            }
        }

        res.status(500).json({ error: "Failed to delete ticket", });
    }
};