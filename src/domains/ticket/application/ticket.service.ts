import { TicketResponseDTO } from "../dto/ticket.response.dto";
import type { TicketRepository } from "../repository/ticket.repository";

export class TicketService {
  constructor(private readonly repo: TicketRepository) { }
  async getBoards(): Promise<Record<string, TicketResponseDTO[]>> {
    const boards = await this.repo.getBoards()
    const grouped: Record<string, TicketResponseDTO[]> = {
      New: [],
      Attending: [],
      Completed: [],
      Escalated: [],
    }
    for (const board of boards) {
      grouped[board.status].push(new TicketResponseDTO(board))
    }
    return grouped
  }
}