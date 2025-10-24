import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const programInfoSchema = z.object({
  programme: z.string().nonoptional('Programme is required'),
  expectations: z.string().nonoptional('Expectations are required'),
  knowledge: z.string().nonoptional('Knowledge is required'),
  organization: z.string().nonoptional('Organization is required'),
  similar_participation: z
    .string()
    .nonoptional('Similar participation is required'),
  previous_fmyd: z.string().nonoptional('Previous FMYD is required'),
});

export class ProgramInfoDto {
  @ApiProperty({
    description: 'Name of the program/programme',
    example: 'Youth Development Program',
    type: String,
    required: true,
  })
  programme: string;

  @ApiProperty({
    description: 'User expectations from the program',
    example: 'Learn new skills and gain experience',
    type: String,
    required: true,
  })
  expectations: string;

  @ApiProperty({
    description: 'User existing knowledge and skills',
    example: 'Basic computer skills and programming',
    type: String,
    required: true,
  })
  knowledge: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'IDCODE Foundation',
    type: String,
    required: true,
  })
  organization: string;

  @ApiProperty({
    description: 'Details of similar program participation',
    example: 'Yes, participated in tech bootcamp',
    type: String,
    required: true,
  })
  similar_participation: string;

  @ApiProperty({
    description: 'Previous FMYD participation status',
    example: 'No',
    type: String,
    required: true,
  })
  previous_fmyd: string;
}
