import { IsNumber, IsDateString, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  patient_id: number;

  @IsNumber()
  doctor_id: number;

  @IsDateString()
  appointment_date: string;

  @IsString()
  appointment_time: string;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointment_date?: string;

  @IsOptional()
  @IsString()
  appointment_time?: string;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @IsEnum(['booked', 'completed', 'cancelled', 'rescheduled'])
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}