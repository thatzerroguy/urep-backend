import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const smsSchema = z.object({
  phoneNumber: z
    .string()
    .length(13, 'Phone number must be 13 digits (234XXXXXXXXXX)')
    .regex(/^234\d{10}$/, 'Phone number must start with 234 and contain 13 digits'),
});

export type SmsDtoType = z.infer<typeof smsSchema>;

export class SmsDto {
  @ApiProperty({
    description: 'Phone number to send OTP to (with 234 country code)',
    example: '2348012345678',
    minLength: 13,
    maxLength: 13,
    pattern: '^234\\d{10}$',
  })
  phoneNumber!: string;
}
