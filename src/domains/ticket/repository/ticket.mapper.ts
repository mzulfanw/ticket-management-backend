import { Types } from "mongoose";
import type { TicketEntity, TicketLog } from "../domain/ticket.entity";
import type { SafeUserEntity } from "../../auth/domain/auth.entity";

export type TicketMongoResult = Omit<TicketEntity, "createdBy" | "assignedTo" | "escalatedBy" | "logs"> & {
  createdBy: SafeUserEntity | Types.ObjectId;
  assignedTo?: SafeUserEntity | Types.ObjectId;
  escalatedBy?: SafeUserEntity | Types.ObjectId;
  logs?: {
    actionBy: SafeUserEntity | Types.ObjectId;
    role: "L1" | "L2" | "L3";
    note: string;
    createdAt?: Date;
  }[];
};

const toId = (id: Types.ObjectId | string | undefined | null): string | null =>
  id ? (typeof id === "string" ? id : id.toString()) : null;

const mapUser = (
  user: SafeUserEntity | Types.ObjectId | undefined | null
): SafeUserEntity | undefined => {
  if (!user || user instanceof Types.ObjectId) return undefined;

  return {
    _id: toId(user._id)!,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export function mapToTicketEntity(raw: TicketMongoResult): TicketEntity {
  return {
    _id: toId(raw._id)!,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    expectedCompletion: raw.expectedCompletion,
    priority: raw.priority,
    status: raw.status,
    criticalLevel: raw.criticalLevel ?? null,
    escalationLevel: raw.escalationLevel,
    resolution: raw.resolution ?? undefined,
    closedAt: raw.closedAt ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    createdBy: mapUser(raw.createdBy)!,
    assignedTo: mapUser(raw.assignedTo),
    escalatedBy: mapUser(raw.escalatedBy),
    logs: Array.isArray(raw.logs)
      ? raw.logs
        .map((log): TicketLog | null => {
          const actor = mapUser(log.actionBy);
          if (!actor) return null;
          return {
            actionBy: actor,
            role: log.role,
            note: log.note,
            createdAt: log.createdAt,
          };
        })
        .filter((log): log is TicketLog => log !== null)
      : [],
  };
}
