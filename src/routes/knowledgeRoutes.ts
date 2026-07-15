import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";
import * as knowledgeController from "../controllers/knowledgeController";

const router = Router();

router.use(authenticate);

router.get("/", knowledgeController.getKnowledgeList);

router.get("/:id", knowledgeController.getKnowledge);

router.post("/", requireRole("ADMIN"), knowledgeController.createKnowledge);

router.put("/:id", requireRole("ADMIN"), knowledgeController.updateKnowledge);

router.delete("/:id", requireRole("ADMIN"), knowledgeController.deleteKnowledge);

export default router;