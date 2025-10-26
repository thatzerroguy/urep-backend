import { ApiProperty } from '@nestjs/swagger';
import { FormFieldDto } from './form-field.dto';

export class FormCreationDto {
  @ApiProperty({
    description: 'The programme ID to which this form belongs',
    example: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
  })
  programme_id: string;

  @ApiProperty({
    description: 'An array of form fields to be created',
    type: [FormFieldDto],
  })
  fields: FormFieldDto[];
}
