import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ninRequestSchema = z.object({
  nin: z
    .string()
    .length(11, 'NIN must be exactly 11 digits')
    .regex(/^\d+$/, 'NIN must contain only digits'),
});

export type NinRequestDtoType = z.infer<typeof ninRequestSchema>;

export class NinRequestDto {
  @ApiProperty({
    description: 'National Identification Number (11 digits)',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
    pattern: '^\\d{11}$',
  })
  nin!: string;
}
