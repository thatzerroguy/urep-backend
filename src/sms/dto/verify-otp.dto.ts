import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .length(13, 'Phone number must be 13 digits (234XXXXXXXXXX)')
    .regex(/^234\d{10}$/, 'Phone number must start with 234 and contain 13 digits'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export type VerifyOtpDtoType = z.infer<typeof verifyOtpSchema>;

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Phone number that received the OTP (with 234 country code)',
    example: '2348012345678',
    minLength: 13,
    maxLength: 13,
    pattern: '^234\\d{10}$',
  })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Six-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^\\d{6}$',
  })
  otp!: string;
}
