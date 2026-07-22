import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as adminUserService from "../services/adminUserService";

export async function getUsers(req: AuthRequest, res: Response) {
    try {
        const users = await adminUserService.getUsers(
            req.user!.tenantId
        );

        res.json(
            users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                createdAt: user.createdAt,
            }))
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to load users", });
    }
}

export async function createUser(req: AuthRequest, res: Response) {
    try {
        const { name, email, password, role, } = req.body;

        const user = await adminUserService.createUser(
            req.user!.tenantId,
            name,
            email,
            password,
            role,
        );

        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Unable to create user", });
    }
}

export async function updateUser(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;
        const { name, email, role, } = req.body;

        const user = await adminUserService.updateUser(
            req.user!.tenantId,
            req.user!.uid,
            id,
            name,
            email,
            role,
        );

        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Unable to update user", });
    }
}

export async function changePassword(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;
        const { password } = req.body;

        const result = await adminUserService.changePassword(
            req.user!.tenantId,
            req.user!.uid,
            id,
            password,
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Unable to reset password", });
    }
}

export async function deleteUser(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const result = await adminUserService.deleteUser(
            req.user!.tenantId,
            req.user!.uid,
            id,
        );

        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Unable to delete user", });
    }
}