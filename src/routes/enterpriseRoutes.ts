import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";
import * as enterpriseController from "../controllers/enterpriseController";

const router = Router();

router.use(authenticate);

router.use(requireRole("ENTERPRISE"));

router.get("/dashboard", enterpriseController.getDashboard);

export default router;