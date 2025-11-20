import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';

export enum AcademicLevel {
  HIGH_SCHOOL = 'high_school',
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  PROFESSIONAL = 'professional',
  OTHER = 'other',
}

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;

  @IsEnum(AcademicLevel)
  @IsNotEmpty()
  academicLevel: AcademicLevel;

  @IsString()
  @IsNotEmpty()
  institution: string;
}
