import { Router } from "express";
import { TicketRepository } from "../repository/ticket.repository";
import { TicketService } from "../application/ticket.service";
import { TicketController } from "./ticket.controller";
import { asyncHandler } from "../../../middleware/async";
import { authenticate, authorize } from "../../../middleware/auth";
import { validate } from "../../../middleware/validate";
import { CreateTicketSchema, UpdateStatusSchema, EscalateTicketSchema } from "../dto/ticket.request.dto";
import ROLES from "../../../constants/roles";

const router = Router()
const repo = new TicketRepository()
const service = new TicketService(repo)
const controller = new TicketController(service)

router.get('/boards', authenticate, asyncHandler(controller.getAll.bind(controller)))
router.post('/', authenticate, authorize(ROLES.L1), validate(CreateTicketSchema), asyncHandler(controller.createTicket.bind(controller)))
router.put('/:id/status', authenticate, authorize(ROLES.L1), validate(UpdateStatusSchema), asyncHandler(controller.updateStatusTicket.bind(controller)))
router.put('/:id/escalate', authenticate, authorize(ROLES.L1, ROLES.L2), validate(EscalateTicketSchema), asyncHandler(controller.escalate.bind(controller)))

export default router