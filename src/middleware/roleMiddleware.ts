import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import { UserRole } from "../../generated/prisma";

export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!roles.includes(req.user.role as UserRole)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
}