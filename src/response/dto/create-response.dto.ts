import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ResponseSchema = z.object({
  form_field_id: z.string().uuid(),
  answer: z.string().min(1, 'Answer is required'),
});

export class ResponseDto {
  @ApiProperty({
    description: 'The ID of the form field this answer belongs to',
    example: 'a43b2dcd-2025-4e1b-9e0c-3cb9c2e9a1a0',
  })
  form_field_id: string;

  @ApiProperty({
    description: 'The user’s answer to the form field',
    example: 'I have prior experience in software development',
  })
  answer: string;
}

export const SubmitProgrammeFormSchema = z.object({
  programme_id: z.string().uuid(),
  responses: z
    .array(ResponseSchema)
    .nonempty('At least one response is required'),
});

export class SubmitProgrammeFormDto {
  @ApiProperty({
    description: 'The programme being applied for',
    example: 'c33aa3e4-6a55-4cba-86b3-36e4c9a4b2a3',
  })
  programme_id: string;

  @ApiProperty({
    description: 'List of responses to programme form fields',
    type: [ResponseDto],
  })
  responses: ResponseDto[];
}
