import TicketModel from "../../../models/Ticket";
import { TicketEntity, TicketRepository as TRepository } from "../domain/ticket.entity";
import { mapToTicketEntity } from "./ticket.mapper";
import type { TicketMongoResult } from "./ticket.mapper";

export class TicketRepository implements TRepository {
  async getBoards(): Promise<TicketEntity[]> {
    const _tickets = await TicketModel.find()
      .populate("createdBy assignedTo escalatedBy logs.actionBy", "name email role") // safe populate
      .lean<TicketMongoResult[]>();

    return _tickets.map(mapToTicketEntity);
  }
}
