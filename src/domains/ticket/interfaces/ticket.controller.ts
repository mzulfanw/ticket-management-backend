import type { Request, Response } from "express"
import { TicketService } from "../application/ticket.service";
import { ApiSuccess } from "../../../utils/api.success";
import MESSAGES from "../../../constants/message";
import { SafeUserEntity } from "../../auth/domain/auth.entity";
import httpStatus from "http-status"
import type { TicketQuery } from "../dto/ticket.request.dto";

export class TicketController {
  constructor(private readonly ticketService: TicketService) { }
  async getAll(req: Request, res: Response) {
    const { user, query } = req
    const _boards = await this.ticketService.getBoards(query as TicketQuery, user as SafeUserEntity)
    return new ApiSuccess(_boards, MESSAGES.TICKET.SUCCESS_RETRIEVED_DATA).send(res)
  }
  async createTicket(req: Request, res: Response) {
    const { body, user } = req
    const result = await this.ticketService.create(body, user as SafeUserEntity)
    return new ApiSuccess(result, MESSAGES.TICKET.SUCCESS_CREATED_DATA, httpStatus.CREATED).send(res)
  }
  async updateStatusTicket(req: Request, res: Response) {
    const { body, user } = req
    const { id } = req.params
    const result = await this.ticketService.updateStatus(id, body, user as SafeUserEntity)
    return new ApiSuccess(result, MESSAGES.TICKET.SUCCESS_UPDATE_DATA).send(res)
  }
  async escalate(req: Request, res: Response) {
    const { body, user } = req
    const { id } = req.params
    const result = await this.ticketService.escalate(id, body, user as SafeUserEntity)
    return new ApiSuccess(result, MESSAGES.TICKET.SUCCESS_UPDATE_DATA).send(res)
  }
  async criticalValue(req: Request, res: Response) {
    const { body, user } = req
    const { id } = req.params
    const result = await this.ticketService.criticalValues(id, body, user as SafeUserEntity)
    return new ApiSuccess(result, MESSAGES.TICKET.SUCCESS_CRITICAL_DATA).send(res)
  }
  async closeTicket(req: Request, res: Response) {
    const { body, user } = req
    const { id } = req.params
    const result = await this.ticketService.closeTicket(id, body, user as SafeUserEntity)
    return new ApiSuccess(result, MESSAGES.TICKET.SUCCESS_CLOSE_TICKET).send(res)
  }
}