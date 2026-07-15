import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as knowledgeService from "../services/knowledgeService";

export async function getKnowledgeList(req: AuthRequest, res: Response) {
    try {
        const data = await knowledgeService.getKnowledgeList(
            req.user!.tenantId
        );

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch knowledge base", });
    }
}

export async function getKnowledge(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const article = await knowledgeService.getKnowledge(
            req.user!.tenantId,
            id
        );

        if (!article) {
            return res.status(404).json({ message: "Knowledge article not found", });
        }

        res.json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch article", });
    }
}

export async function createKnowledge(req: AuthRequest, res: Response) {
    try {
        const { title, content } = req.body;

        const article = await knowledgeService.createKnowledge(
            req.user!.tenantId,
            title,
            content
        );

        res.status(201).json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create article", });
    }
}

export async function updateKnowledge(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const article = await knowledgeService.updateKnowledge(
            req.user!.tenantId,
            id,
            req.body
        );

        res.json(article);
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "Knowledge article not found") {
            return res.status(404).json({ message: error.message, });
        }

        res.status(500).json({ message: "Failed to update article", });
    }
}

export async function deleteKnowledge(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        await knowledgeService.deleteKnowledge(
            req.user!.tenantId,
            id
        );

        res.json({ message: "Deleted", });
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "Knowledge article not found") {
            return res.status(404).json({ message: error.message, });
        }

        res.status(500).json({ message: "Failed to delete article", });
    }
}