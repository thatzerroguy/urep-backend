import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Zod validation schema for form fields
 */
export const FormFieldSchema = z.object({
  programme_id: z.string().uuid('Programme ID must be a valid UUID'),
  label: z.string().min(1, 'Field label is required'),
  type: z.enum(['text', 'number', 'select', 'radio', 'checkbox', 'date']),
  required: z.boolean().default(false),
  options: z
    .array(z.string())
    .optional()
    .describe('Options available for select/radio/checkbox fields'),
});

/**
 * DTO class for Swagger documentation & typing
 */
export class FormFieldDto {
  @ApiProperty({
    description: 'The ID of the programme this form field belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: String,
  })
  programme_id: string;

  @ApiProperty({
    description: 'The label of the form field shown to users',
    example: 'What is your area of expertise?',
    type: String,
  })
  label: string;

  @ApiProperty({
    description: 'The type of form field',
    example: 'select',
    enum: ['text', 'number', 'select', 'radio', 'checkbox', 'date'],
  })
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date';

  @ApiProperty({
    description: 'Whether the field is required or optional',
    example: true,
    type: Boolean,
  })
  required: boolean;

  @ApiPropertyOptional({
    description: 'Options available if the field type requires selection',
    example: ['Technology', 'Arts', 'Science'],
    type: [String],
  })
  options?: string[];
}
