import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
// import {
//   IsString,
//   IsOptional,
//   IsEnum,
//   IsInt,
//   Min,
//   Max,
//   MaxLength,
// } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { PlanStatus } from '../enums/plan-status.enum';

// export class UpdatePlanDto {
//   @ApiPropertyOptional({ example: 'Updated Plan Name' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(255)
//   name?: string;

//   @ApiPropertyOptional({ example: 'Updated description' })
//   @IsOptional()
//   @IsString()
//   description?: string;

//   @ApiPropertyOptional({ enum: PlanStatus })
//   @IsOptional()
//   @IsEnum(PlanStatus)
//   status?: PlanStatus;

//   @ApiPropertyOptional({ example: 75, minimum: 0, maximum: 100 })
//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   @Max(100)
//   progress?: number;
// }
