import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized", });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden: Admin access only", });
    }

    next();
}