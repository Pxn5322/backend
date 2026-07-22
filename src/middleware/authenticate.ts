import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin";
import { getTenantUser } from "../services/userService";

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        name: string;
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

        const dbUser = await getTenantUser(decoded.uid,);

        if (!dbUser) {
            return res.status(401).json({ message: "User not registered.", });
        }

        req.user = {
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            tenantId: dbUser.tenantId
        };

        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message: error instanceof Error
                ? error.message
                : "Invalid authentication token"
        });
    }
}