import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class CreateUserDto {
  @ApiProperty({
    description: 'Organisation name',
    example: 'IDCODE',
    type: String,
  })
  organisation: string;

  @ApiProperty({
    description: 'National Identification Number (20 characters)',
    example: '12345678901234567890',
    type: String,
    minLength: 20,
    maxLength: 20,
  })
  nin: string;

  @ApiPropertyOptional({
    description: 'One-time password (optional)',
    example: '123456',
    type: String,
  })
  otp?: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters recommended)',
    example: 'SecurePassword123!',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'Phone number with country code',
    example: '+2348012345678',
    type: String,
  })
  phone: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD format)',
    example: '1990-01-01',
    type: String,
  })
  dob: string;

  @ApiProperty({
    description: 'Gender of the user',
    example: 'male',
    enum: ['male', 'female', 'other'],
    type: String,
  })
  gender: string;

  @ApiProperty({
    description: 'State of residence',
    example: 'Lagos',
    type: String,
  })
  state: string;

  @ApiProperty({
    description: 'Local Government Area',
    example: 'Ikeja',
    type: String,
  })
  lga: string;

  @ApiProperty({
    description: 'Unique ID code',
    example: 'IDC001',
    type: String,
  })
  idcode: string;

  @ApiProperty({
    description: 'Acceptance of terms and conditions',
    example: true,
    type: Boolean,
    default: false,
  })
  terms: boolean;
}
