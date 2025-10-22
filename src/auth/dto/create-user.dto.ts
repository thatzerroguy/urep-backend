import { z } from 'zod';

export const createUserSchema = z.object({
  organisation: z.string(),
  nin: z.string().length(20).nonoptional('NIN is required'),
  otp: z.string().optional(),
  name: z.string(),
  email: z.email({ pattern: z.regexes.email }).nonoptional('Email is required'),
  password: z.string(),
  phone: z.string().nonoptional('Phone is required'),
  dob: z.string().nonoptional('Date of birth is required'),
  gender: z.string().nonoptional('Gender is required'),
  state: z.string().nonoptional('State is required'),
  lga: z.string().nonoptional('Local government area is required'),
  idcode: z.string().nonoptional('ID code is required'),
  terms: z
    .boolean()
    .default(false)
    .nonoptional('Terms and conditions are required'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
