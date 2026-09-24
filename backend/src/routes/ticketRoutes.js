import { Router } from "express";
import {
  createTicket,
  getTicketById,
  getTicketStats,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";

const router = Router();

router.post("/", createTicket);
router.get("/stats", getTicketStats);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.patch("/:id", updateTicket);

export default router;
