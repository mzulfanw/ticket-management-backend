import { z } from "zod";

export const CreateTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  category: z.string(),
  expectedCompletion: z.iso.datetime(),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['New', 'Attending', 'Completed']),
});

export const EscalateTicketSchema = z.object({
  toLevel: z.union([z.literal(1), z.literal(2)]), // 1: L2, 2: L3
  note: z.string(),
});

export const AssignCriticalLevelSchema = z.object({
  level: z.enum(['C1', 'C2', 'C3']),
  note: z.string(),
});

export const AddLogSchema = z.object({
  note: z.string().min(1),
});

export const CloseTicketSchema = z.object({
  resolution: z.string().min(1),
});


export type CreateTicket = z.infer<typeof CreateTicketSchema>

export type UpdateTicketStatus = z.infer<typeof UpdateStatusSchema>

export type EscalateTicket = z.infer<typeof EscalateTicketSchema>