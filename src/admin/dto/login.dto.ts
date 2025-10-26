import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const loginSchema = z.object({
  email: z.email({ pattern: z.regexes.email }).nonoptional('Email is required'),
  password: z.string().nonoptional('Password is required'),
});

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    type: String,
    required: true,
  })
  password: string;
}
