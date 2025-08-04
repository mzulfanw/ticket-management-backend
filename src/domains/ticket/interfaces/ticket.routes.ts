import { Router } from "express";
import { TicketRepository } from "../repository/ticket.repository";
import { TicketService } from "../application/ticket.service";
import { TicketController } from "./ticket.controller";
import { asyncHandler } from "../../../middleware/async";
import { authenticate, authorize } from "../../../middleware/auth";
import { validate } from "../../../middleware/validate";
import { CreateTicketSchema, UpdateStatusSchema, EscalateTicketSchema, AssignCriticalLevelSchema, CloseTicketSchema, TicketQuerySchema } from "../dto/ticket.request.dto";
import ROLES from "../../../constants/roles";

const router = Router()
const repo = new TicketRepository()
const service = new TicketService(repo)
const controller = new TicketController(service)

router.get('/boards', authenticate, validate(TicketQuerySchema, 'query'), asyncHandler(controller.getAll.bind(controller)))
router.post('/', authenticate, authorize(ROLES.L1), validate(CreateTicketSchema), asyncHandler(controller.createTicket.bind(controller)))
router.put('/:id/status', authenticate, authorize(ROLES.L1), validate(UpdateStatusSchema), asyncHandler(controller.updateStatusTicket.bind(controller)))
router.put('/:id/escalate', authenticate, authorize(ROLES.L1, ROLES.L2), validate(EscalateTicketSchema), asyncHandler(controller.escalate.bind(controller)))
router.put('/:id/critical-value', authenticate, authorize(ROLES.L2), validate(AssignCriticalLevelSchema), asyncHandler(controller.criticalValue.bind(controller)))
router.put('/:id/close-ticket', authenticate, authorize(ROLES.L3), validate(CloseTicketSchema), asyncHandler(controller.closeTicket.bind(controller)))

export default router