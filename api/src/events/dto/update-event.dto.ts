import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { EventStatus } from '../enums/event-status.enum';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  status?: EventStatus;
}
