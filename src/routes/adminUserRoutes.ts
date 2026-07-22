import { Router } from "express";
import * as adminUserController from "../controllers/adminUserController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.use(authenticate);

router.use(requireRole("ADMIN"));

router.get("/", adminUserController.getUsers);

router.post("/", adminUserController.createUser);

router.put("/:id", adminUserController.updateUser);

router.put("/:id/password", adminUserController.changePassword);

router.delete("/:id", adminUserController.deleteUser);

export default router;