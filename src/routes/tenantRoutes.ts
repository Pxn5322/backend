import { Router } from "express";
import * as tenantController from "../controllers/tenantController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("ENTERPRISE"), tenantController.getCompanies);

router.get("/:id", requireRole("ENTERPRISE", "ADMIN"), tenantController.getTenant);

router.post("/register-company", requireRole("ENTERPRISE"), tenantController.registerCompany);

router.put("/:id", requireRole("ENTERPRISE", "ADMIN"), tenantController.updateTenant);

router.delete("/:id", requireRole("ENTERPRISE"), tenantController.deleteTenant);

export default router;