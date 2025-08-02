import { Router } from "express";
import { TicketRepository } from "../repository/ticket.repository";
import { TicketService } from "../application/ticket.service";
import { TicketController } from "./ticket.controller";
import { asyncHandler } from "../../../middleware/async";
import { authenticate } from "../../../middleware/auth";

const router = Router()
const repo = new TicketRepository()
const service = new TicketService(repo)
const controller = new TicketController(service)

router.get('/boards', authenticate, asyncHandler(controller.getAll.bind(controller)))

export default router