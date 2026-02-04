import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsNumber()
  capacity: number;

  @IsOptional()
  createdBy?: string;

  @IsOptional()
  photoUrl?: string;
}
