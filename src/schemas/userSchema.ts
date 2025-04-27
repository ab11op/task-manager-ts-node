import { z } from 'zod';

const roles = ["user", "admin"] as const;

export const userRegistrationSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(roles),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});