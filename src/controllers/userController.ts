import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as userService from "../services/userService";

export async function getUsers(req: AuthRequest, res: Response) {
    try {
        const users = await userService.getUsers(
            req.user!.tenantId
        );

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to load users", });
    }
}

export async function updateRole(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;
        const { role } = req.body;

        const user = await userService.updateUserRole(
            req.user!.tenantId,
            id,
            role
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