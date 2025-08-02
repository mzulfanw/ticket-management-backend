import type { Request, Response } from "express"
import { TicketService } from "../application/ticket.service";
import { ApiSuccess } from "../../../utils/api.success";
import { TicketResponseDTO } from "../dto/ticket.response.dto";

export class TicketController {
  constructor(private readonly ticketService: TicketService) { }
  async getAll(req: Request, res: Response) {
    const _boards = await this.ticketService.getBoards()
    return new ApiSuccess(_boards, 'OK').send(res)
  }
}