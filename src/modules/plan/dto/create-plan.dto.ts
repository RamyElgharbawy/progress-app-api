import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanStatus } from '../enums/plan-status.enum';

export class CreatePlanDto {
  @ApiProperty({ example: 'Construction Project Q1 2026' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Main construction plan for Q1' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: PlanStatus, default: PlanStatus.DRAFT })
  @IsOptional()
  @IsEnum(PlanStatus)
  status?: PlanStatus;
}
