import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/register", authController.register);

router.use(authenticate);

router.get("/me", authController.getProfile);

export default router;