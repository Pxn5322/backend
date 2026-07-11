import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email: string;
        role: string;
        tenantId: string;
    }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing authentication token" });
        }

        const token = authHeader.replace("Bearer ", "");
        const decoded = await adminAuth.verifyIdToken(token);

        const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid }
        });

        if (!dbUser) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            uid: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            tenantId: dbUser.tenantId
        };

        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid authentication token" });
    }
}