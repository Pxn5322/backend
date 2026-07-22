import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";
import * as userController from "../controllers/userController";

const router = Router();

router.use(authenticate);

router.use(requireRole("ENTERPRISE", "ADMIN"));

router.get("/", userController.getTenantUsers);

router.put("/:id/role", userController.updateTenantUser);

export default router;