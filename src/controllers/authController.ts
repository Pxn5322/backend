import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as authService from "../services/authService";

export async function getProfile(req: AuthRequest, res: Response) {
    try {
        const uid = req.user!.uid;
        const user = await authService.getCurrentUser(uid);

        if (!user) {
            return res.status(404).json({ message: "User not found", });
        }

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to retrieve profile", });
    }
}