import { Response } from "express";
import * as ticketService from "../services/ticketService";
import { AuthRequest } from "../middleware/authenticate";
import * as knowledgeService from "../services/knowledgeService";
import * as aiService from "../services/aiService";
import { findRelevantKnowledge } from "../utils/knowledgeSearch";

export const getTickets = async (req: AuthRequest, res: Response) => {
    try {
        const tickets = await ticketService.getTickets(
            req.user!.tenantId,
            req.user!.uid,
            req.user!.role
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
            req.user!.uid,
            req.user!.role,
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
        const { title, rawText, attachmentUrl } = req.body;

        const ticket = await ticketService.createTicket(
            req.user!.tenantId,
            req.user!.uid,
            title,
            rawText,
            attachmentUrl
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
            req.user!.uid,
            req.user!.role,
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

            if (error.message === "Forbidden") {
                return res.status(403).json({ message: error.message, });
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
            req.user!.uid,
            req.user!.role,
            id
        );

        res.json({ message: "Ticket deleted successfully", });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            if (error.message === "Ticket not found") {
                return res.status(404).json({ message: error.message });
            }

            if (error.message === "Forbidden") {
                return res.status(403).json({ essage: error.message, });
            }
        }

        res.status(500).json({ error: "Failed to delete ticket", });
    }
};

export async function generateTicketReply(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const ticket = await ticketService.getTicket(
            req.user!.tenantId,
            req.user!.uid,
            req.user!.role,
            id
        );

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", });
        }

        const allKnowledge = await knowledgeService.getKnowledgeForAI(
            req.user!.tenantId
        );

        const knowledge = findRelevantKnowledge(
            allKnowledge,
            ticket.title + " " + ticket.rawText
        );

        const reply = await aiService.generateReply({
            title: ticket.title,
            rawText: ticket.rawText,
            knowledge,
        });

        res.json({ reply, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to generate reply", });
    }

}

export async function ticketAnalysis(req: AuthRequest, res: Response) {
    try {
        const ticketId = req.params.id as string;

        const ticket = await ticketService.getTicket(
            req.user!.tenantId,
            req.user!.uid,
            req.user!.role,
            ticketId
        );

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found", });
        }

        const result = await aiService.generateTicketAnalysis(
            ticket.title,
            ticket.rawText
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI analysis failed", });
    }
}