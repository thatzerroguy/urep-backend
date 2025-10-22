import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ pattern: z.regexes.email }).nonoptional('Email is required'),
  password: z.string().nonoptional('Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;
