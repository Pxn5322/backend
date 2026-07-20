import { Router } from "express";
import * as ticketController from "../controllers/ticketController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();
router.use(authenticate);

router.get("/", ticketController.getTickets);

router.get("/:id", ticketController.getTicket);

router.post("/", ticketController.createTicket);

router.post("/:id/analyze", ticketController.ticketAnalysis);

router.post("/:id/reply", ticketController.generateTicketReply);

router.put("/:id", ticketController.updateTicket);

router.delete("/:id", requireRole("ADMIN"), ticketController.deleteTicket);

export default router;