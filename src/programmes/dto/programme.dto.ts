import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const ProgrammeSchema = z.object({
  name: z.string().nonoptional('Name is required'),
  description: z.string().nonoptional('Description is required'),
  objectives: z.array(z.string()).nonoptional('Objectives are required'),
  target_audience: z
    .array(z.string())
    .nonoptional('Target audience is required'),
  start_date: z.string().nonoptional('Start date is required'),
  end_date: z.string().nonoptional('End date is required'),
  isActive: z.boolean().nonoptional('Is active is required'),
});

export class ProgrammeDto {
  @ApiProperty({
    description: 'Programme name',
    example: 'Youth Development Program',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Programme description',
    example: 'Learn new skills and gain experience',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Programme objectives',
    example: ['Learn new skills', 'Gain experience'],
    type: String,
  })
  objectives: string[];

  @ApiProperty({
    description: 'Programme target audience',
    example: ['Youth', 'Adults'],
    type: String,
  })
  target_audience: string[];

  @ApiProperty({
    description: 'Programme start date',
    example: '2023-01-01',
    type: String,
  })
  start_date: string;

  @ApiProperty({
    description: 'Programme end date',
    example: '2023-12-31',
    type: String,
  })
  end_date: string;

  @ApiProperty({
    description: 'Is programme active',
    example: true,
    type: Boolean,
  })
  isActive: boolean;
}
