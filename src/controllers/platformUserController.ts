import { Request, Response } from "express";
import * as service from "../services/platformUserService";

export async function getUsers(req: Request, res: Response) {
    try {
        res.json(await service.getAllUsers());
    } catch (error) {
        res.status(500).json({ message: "Unable to load users", });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const user = await service.updatePlatformUser(
            id,
            req.body
        );

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Unable to update user" });
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        await service.changePassword(
            id,
            req.body.password
        );

        res.json({ message: "Password updated" });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Unable" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        await service.deletePlatformUser(
            id
        );

        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(400).json({ message: err instanceof Error ? err.message : "Unable" });
    }
}