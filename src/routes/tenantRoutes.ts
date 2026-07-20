import { Router } from "express";
import * as tenantController from "../controllers/tenantController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.use(authenticate);

router.use(requireRole("ADMIN"));

router.get("/", tenantController.getTenants);

router.get("/:id", tenantController.getTenant);

router.post("/", tenantController.createTenant);

router.put("/:id", tenantController.updateTenant);

router.delete("/:id", tenantController.deleteTenant);

export default router;