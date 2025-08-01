import { z } from 'zod';

export const LoginRequestDTO = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestDTO>