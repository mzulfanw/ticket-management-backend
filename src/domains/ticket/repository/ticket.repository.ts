import TicketModel from "../../../models/Ticket";
import { TicketEntity, TicketRepository as TRepository } from "../domain/ticket.entity";
import { TicketQuery } from "../dto/ticket.request.dto";
import { mapToTicketEntity } from "./ticket.mapper";
import type { TicketMongoResult } from "./ticket.mapper";

export class TicketRepository implements TRepository {
  async getBoards(query: TicketQuery): Promise<TicketEntity[]> {
    let where: TicketQuery = {}
    if (query.status) {
      where.status = query.status
    }
    if (query.priority) {
      where.priority = query.priority
    }
    if (query.escalationLevel) {
      where.escalationLevel = query.escalationLevel
    }
    const _tickets = await TicketModel.find(where)
      .populate("createdBy assignedTo escalatedBy logs.actionBy", "name email role") // safe populate
      .lean<TicketMongoResult[]>();

    return _tickets.map(mapToTicketEntity);
  }
  async create(data: Partial<TicketEntity>): Promise<TicketEntity> {
    const result = await TicketModel.create(data)
    return result.populate("createdBy assignedTo escalatedBy logs.actionBy")
  }
  async findById(id: string): Promise<TicketEntity | null> {
    const result = await TicketModel.findById(id)
      .populate("createdBy assignedTo escalatedBy logs.actionBy")
      .lean<TicketMongoResult | null>();
    return result ? mapToTicketEntity(result) : null;
  }
  async update(id: string, data: Partial<TicketEntity>): Promise<TicketEntity> {
    const currentTicket = await TicketModel.findById(id)
    if (!currentTicket) throw new Error(`Ticket with ${id} not found`)
    const updateData: any = {
      updatedAt: new Date(),
    };
    if (data.status) {
      updateData.status = data.status;
    }
    if (data.escalationLevel) {
      updateData.escalationLevel = data.escalationLevel
    }
    if (data.criticalLevel) {
      updateData.criticalLevel = data.criticalLevel
    }
    if (data.logs && data.logs.length > 0) {
      updateData.logs = [...currentTicket.logs, ...data.logs];
    }
    if (data.closedAt) {
      updateData.closedAt = data.closedAt
    }
    if (data.resolution) {
      updateData.resolution = data.resolution
    }
    const updated = await TicketModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate("createdBy assignedTo escalatedBy logs.actionBy");
    if (!updated) {
      throw new Error(`Update failed`);
    }
    const plain = updated.toObject<TicketMongoResult>();
    return mapToTicketEntity(plain);
  }

}
