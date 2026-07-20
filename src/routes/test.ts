import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/authenticate";
import { adminAuth } from "../config/firebaseAdmin";
import { requireRole } from "../middleware/roleMiddleware";
import { analyzeTicket } from "../services/aiService";

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

router.get("/test-ai", async (_, res) => {
    try {
        const result = await analyzeTicket(
            "Payment server is down",
            "Customers cannot pay and every checkout fails."
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI failed" });
    }
});

export default router;