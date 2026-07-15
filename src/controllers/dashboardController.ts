import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as dashboardService from "../services/dashboardService";

export async function getDashboard(req: AuthRequest, res: Response) {
    try {
        const dashboard = await dashboardService.getDashboardStats(
            req.user!.tenantId
        );

        res.json(dashboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to load dashboard", });
    }
}