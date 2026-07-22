import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";
import * as controller from "../controllers/platformUserController";

const router = Router();

router.use(authenticate);

router.use(requireRole("ENTERPRISE"));

router.get("/", controller.getUsers);

router.put("/:id", controller.updateUser);

router.put("/:id/password", controller.changePassword);

router.delete("/:id", controller.deleteUser);

export default router;