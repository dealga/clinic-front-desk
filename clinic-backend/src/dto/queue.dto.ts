import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';

export class CreateQueueDto {
  @IsNumber()
  patient_id: number;

  @IsOptional()
  @IsNumber()
  doctor_id?: number;

  @IsOptional()
  @IsEnum(['normal', 'urgent', 'emergency'])
  priority?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateQueueDto {
  @IsOptional()
  @IsNumber()
  doctor_id?: number;

  @IsOptional()
  @IsEnum(['normal', 'urgent', 'emergency'])
  priority?: string;

  @IsOptional()
  @IsEnum(['waiting', 'with_doctor', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
