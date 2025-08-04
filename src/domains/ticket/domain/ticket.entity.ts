import type { SafeUserEntity } from "../../auth/domain/auth.entity";
import { TicketQuery } from "../dto/ticket.request.dto";
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketStatus = 'New' | 'Attending' | 'Completed' | 'Escalated';
export type CriticalLevel = 'C1' | 'C2' | 'C3' | null;
export type EscalationLevel = 0 | 1 | 2; // 0: L1, 1: L2, 2: L3


export interface TicketLog {
  actionBy: SafeUserEntity;
  role: 'L1' | 'L2' | 'L3';
  note: string;
  createdAt?: Date;
}

export interface TicketEntity {
  _id: string;
  title: string;
  description: string;
  category: string;
  expectedCompletion: Date;
  priority: TicketPriority;
  status: TicketStatus;
  criticalLevel?: CriticalLevel;
  createdBy: SafeUserEntity;
  assignedTo?: SafeUserEntity;
  escalatedBy?: SafeUserEntity;
  escalationLevel: EscalationLevel;
  resolution?: string;
  closedAt?: Date;
  logs?: TicketLog[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TicketRepository {
  getBoards(query: TicketQuery): Promise<TicketEntity[]>;
  create(data: Partial<TicketEntity>): Promise<TicketEntity>;
  findById(id: string): Promise<TicketEntity | null>
  update(id: string, data: Partial<TicketEntity>): Promise<TicketEntity>
}