import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/authenticate";
import { adminAuth } from "../config/firebaseAdmin";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.get("/test", authenticate, (req: AuthRequest, res) => {
    res.json({ message: "Success", user: req.user });
});

router.get("/profile", authenticate, (req: AuthRequest, res) => { res.json(req.user); });

router.get("/admin", authenticate, requireRole("ADMIN"), (_, res) => {
    res.json({ message: "Welcome Admin" })
});

router.get("/", async (_, res) => {
    try {
        const users = await adminAuth.listUsers(1);

        res.json({
            success: true,
            users: users.users.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

export default router;