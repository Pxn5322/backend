import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as userService from "../services/userService";
import { UserRole } from "../../generated/prisma";

export async function getTenantUsers(req: AuthRequest, res: Response) {
    try {
        const users = await userService.getTenantUsers(
            req.user!.role as UserRole,
            req.user!.tenantId
        );

        res.json(users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to load users", });
    }
}

export async function updateTenantUser(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const user = await userService.updateTenantUser(
            req.user!.tenantId,
            id,
            req.body
        );

        res.json(user);
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "User not found") {
            return res.status(404).json({ message: error.message, });
        }

        res.status(500).json({ message: "Unable to update role", });
    }
}