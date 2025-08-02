import type { TicketEntity } from "../domain/ticket.entity";

export type TicketResponseUser = {
  id: string;
  name: string;
  email: string;
  role: "L1" | "L2" | "L3";
};

export type TicketLogResponse = {
  actionBy: TicketResponseUser;
  role: "L1" | "L2" | "L3";
  note: string;
  createdAt?: string;
};

export class TicketResponseDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  expectedCompletion: string;
  priority: "Low" | "Medium" | "High";
  status: "New" | "Attending" | "Completed" | "Escalated";
  criticalLevel?: "C1" | "C2" | "C3" | null;
  escalationLevel: 0 | 1 | 2;
  resolution?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  createdBy: TicketResponseUser;
  assignedTo?: TicketResponseUser;
  escalatedBy?: TicketResponseUser;
  logs?: TicketLogResponse[];

  constructor(ticket: TicketEntity) {
    this.id = ticket._id;
    this.title = ticket.title;
    this.description = ticket.description;
    this.category = ticket.category;
    this.expectedCompletion = ticket.expectedCompletion.toISOString();
    this.priority = ticket.priority;
    this.status = ticket.status;
    this.criticalLevel = ticket.criticalLevel ?? null;
    this.escalationLevel = ticket.escalationLevel;
    this.resolution = ticket.resolution;
    this.closedAt = ticket.closedAt?.toISOString();
    this.createdAt = ticket.createdAt?.toISOString();
    this.updatedAt = ticket.updatedAt?.toISOString();

    const mapUser = (u?: TicketEntity["createdBy"]): TicketResponseUser | undefined =>
      u ? { id: u._id, name: u.name, email: u.email, role: u.role } : undefined;

    this.createdBy = mapUser(ticket.createdBy)!;
    this.assignedTo = mapUser(ticket.assignedTo);
    this.escalatedBy = mapUser(ticket.escalatedBy);
    this.logs = ticket.logs?.map(log => ({
      actionBy: mapUser(log.actionBy)!,
      role: log.role,
      note: log.note,
      createdAt: log.createdAt?.toISOString(),
    }));
  }
}
