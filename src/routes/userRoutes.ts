import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";
import * as userController from "../controllers/userController";

const router = Router();

router.use(authenticate);

router.use(requireRole("ADMIN"));

router.get("/", userController.getUsers);

router.put("/:id/role", userController.updateRole);

export default router;