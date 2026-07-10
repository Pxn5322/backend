import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import { getTickets, createTicket, updateTicket, deleteTicket, } from "../controllers/ticketController";

const router = Router();

router.use(requireAuth);

// Everyone can read
router.get("/", getTickets);

// Everyone authenticated can create
router.post("/", createTicket);

// Only ADMIN can edit
router.put("/:id", requireAdmin, updateTicket);

// Only ADMIN can delete
router.delete("/:id", requireAdmin, deleteTicket);

export default router;