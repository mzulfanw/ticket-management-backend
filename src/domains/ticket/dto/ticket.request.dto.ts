import { z } from "zod";

export const CreateTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  category: z.string(),
  expectedCompletion: z.iso.datetime(),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['New', 'Attending', 'Completed'], { error: 'Only status New, Attending, Completed !' }),
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

export const TicketQuerySchema = z.object({
  status: z
    .union([z.literal('New'), z.literal('Attending'), z.literal('Completed'), z.literal('Escalated')])
    .optional(),
  priority: z
    .union([z.literal('Low'), z.literal('Medium'), z.literal('High')])
    .optional(),
  escalationLevel: z
    .union([z.literal('1'), z.literal('2')])
    .transform((val) => Number(val)).optional()
    .optional()
});



export type CreateTicket = z.infer<typeof CreateTicketSchema>

export type UpdateTicketStatus = z.infer<typeof UpdateStatusSchema>

export type EscalateTicket = z.infer<typeof EscalateTicketSchema>

export type AssignCritical = z.infer<typeof AssignCriticalLevelSchema>

export type CloseTicket = z.infer<typeof CloseTicketSchema>

export type TicketQuery = z.infer<typeof TicketQuerySchema>