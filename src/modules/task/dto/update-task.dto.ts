import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// import { ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsOptional,
//   IsString,
//   MaxLength,
//   IsInt,
//   IsBoolean,
//   IsDateString,
//   IsEnum,
//   Min,
//   Max,
// } from 'class-validator';
// import { TaskStatus } from '../enums/task-status.enum';

// export class UpdateTaskDto {
//   @ApiPropertyOptional({ example: 'Updated Task Name' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(255)
//   name?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   jobDescription?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   area?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   department?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsInt()
//   duration?: number;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   plannedDuration?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsBoolean()
//   needPermits?: boolean;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   scheduledStart?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   scheduledEnd?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   actualStart?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   actualEnd?: string;

//   @ApiPropertyOptional({ enum: TaskStatus })
//   @IsOptional()
//   @IsEnum(TaskStatus)
//   status?: TaskStatus;

//   @ApiPropertyOptional({ minimum: 0, maximum: 100 })
//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   @Max(100)
//   progress?: number;
// }
