import { Request, Response } from "express";
import * as enterpriseService from "../services/enterpriseService";

export async function getDashboard(req: Request, res: Response) {
    try {
        const stats = await enterpriseService.getDashboardStats();
        return res.json(stats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to load dashboard.", });
    }
}