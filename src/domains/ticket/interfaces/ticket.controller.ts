import type { Request, Response } from "express"
import { TicketService } from "../application/ticket.service";
import { ApiSuccess } from "../../../utils/api.success";
import { TicketResponseDTO } from "../dto/ticket.response.dto";
import MESSAGES from "../../../constants/message";
import { SafeUserEntity } from "../../auth/domain/auth.entity";
import httpStatus from "http-status"

export class TicketController {
  constructor(private readonly ticketService: TicketService) { }
  async getAll(req: Request, res: Response) {
    const _boards = await this.ticketService.getBoards()
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
}