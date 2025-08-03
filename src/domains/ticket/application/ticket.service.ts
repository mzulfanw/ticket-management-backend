import { TicketResponseDTO } from "../dto/ticket.response.dto";
import type { TicketRepository } from "../repository/ticket.repository";
import {
  CreateTicket,
  EscalateTicket,
  UpdateTicketStatus,
} from "../dto/ticket.request.dto";
import { SafeUserEntity } from "../../auth/domain/auth.entity";
import { TicketEntity } from "../domain/ticket.entity";
import { ApiError } from "../../../utils/api.error";
import httpStatus from "http-status";
import MESSAGES from "../../../constants/message";
import ROLES from "../../../constants/roles";

export class TicketService {
  constructor(private readonly repo: TicketRepository) { }
  async getBoards(
    user: SafeUserEntity
  ): Promise<Record<string, TicketResponseDTO[]>> {
    const boards = await this.repo.getBoards();
    const roleBoardsMap: Record<"L1" | "L2" | "L3", string[]> = {
      L1: ["New", "Attending", "Completed"],
      L2: ["C1", "C2", "C3", "Escalated"],
      L3: ["Critical", "Resolved"],
    };
    const visibleBoards = roleBoardsMap[user.role];
    const grouped: Record<string, TicketResponseDTO[]> = Object.fromEntries(
      visibleBoards.map((key) => [key, []])
    );
    for (const ticket of boards) {
      const dto = new TicketResponseDTO(ticket);
      if (user.role === "L1" && ticket.escalationLevel === 0) {
        if (grouped[ticket.status]) {
          grouped[ticket.status].push(dto);
        }
      }
      if (user.role === "L2" && ticket.escalationLevel === 1) {
        const level = ticket.criticalLevel ?? "Escalated";
        if (grouped[level]) {
          grouped[level].push(dto);
        }
      }
      if (user.role === "L3") {
        if (
          ticket.escalationLevel === 2 &&
          ["C1", "C2"].includes(ticket.criticalLevel as string) &&
          grouped["Critical"]
        ) {
          grouped["Critical"].push(dto);
        }
        if (
          ticket.status === "Completed" &&
          ticket.resolution &&
          grouped["Resolved"]
        ) {
          grouped["Resolved"].push(dto);
        }
      }
    }

    return grouped;
  }

  async create(
    data: CreateTicket,
    user: SafeUserEntity
  ): Promise<TicketResponseDTO> {
    const newTicket: Partial<TicketEntity> = {
      title: data.title,
      description: data.description,
      category: data.category,
      expectedCompletion: new Date(data.expectedCompletion),
      priority: data.priority,
      status: "New",
      escalationLevel: 0,
      createdBy: user,
      assignedTo: user,
      logs: [
        {
          actionBy: user,
          role: user.role,
          note: "Ticket created by L1",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ticket = await this.repo.create(newTicket);
    return new TicketResponseDTO(ticket);
  }
  async updateStatus(
    ticketId: string,
    dto: UpdateTicketStatus,
    user: SafeUserEntity
  ) {
    const ticket = await this.repo.findById(ticketId);
    if (!ticket)
      throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.COMMON.NOT_FOUND);
    const updated = await this.repo.update(ticketId, {
      status: dto.status,
      logs: [
        ...(ticket.logs || []),
        {
          actionBy: user,
          role: user.role,
          note: `Updated status to ${dto.status}`,
          createdAt: new Date(),
        },
      ],
    });
    return new TicketResponseDTO(updated);
  }
  async escalate(ticketId: string, dto: EscalateTicket, user: SafeUserEntity) {
    const ticket = await this.repo.findById(ticketId);
    if (!ticket)
      throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.COMMON.NOT_FOUND);
    if (dto.toLevel <= ticket.escalationLevel) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot escalate to same or lower level (current: L${ticket.escalationLevel + 1
        })`
      );
    }
    const allowedRole =
      dto.toLevel === 1 ? ROLES.L1 : dto.toLevel === 2 ? ROLES.L2 : null;
    if (user.role !== allowedRole) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Only ${allowedRole} can escalate to L${dto.toLevel + 1}`
      );
    }
    const updated = await this.repo.update(ticketId, {
      status: "Escalated",
      escalationLevel: dto.toLevel,
      escalatedBy: user,
      logs: [
        ...(ticket.logs || []),
        {
          actionBy: user,
          role: user.role,
          note: dto.note || `Escalated to L${dto.toLevel + 1}`,
          createdAt: new Date(),
        },
      ],
      updatedAt: new Date(),
    });
    return new TicketResponseDTO(updated);
  }
}