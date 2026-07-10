import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../firebaseAdmin";
import { prisma } from "../lib/prisma";

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string
        role: string
        tenantId: string
        email: string
    }
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        const decoded = await adminAuth.verifyIdToken(token);

        const user = await prisma.user.findUnique({ where: { id: decoded.uid } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            uid: user.id,
            role: user.role,
            tenantId: user.tenantId,
            email: user.email
        };

        next();
    }
    catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
}