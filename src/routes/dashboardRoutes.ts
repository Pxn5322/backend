import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import * as dashboardController from "../controllers/dashboardController";

const router = Router();

router.use(authenticate);

router.get("/", dashboardController.getDashboard);

export default router;