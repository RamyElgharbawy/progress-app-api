import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsDateString,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { DependencyType } from '../enums/dependency-type.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Foundation Work' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Complete foundation excavation and pouring',
  })
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @ApiPropertyOptional({ example: 'Construction Site A' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;

  @ApiPropertyOptional({ example: 'Civil Engineering' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiPropertyOptional({ example: '8 hours' })
  @IsOptional()
  @IsString()
  plannedDuration?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  needPermits?: boolean;

  @ApiProperty({ example: '2026-03-01T08:00:00Z' })
  @IsDateString()
  scheduledStart: string;

  @ApiProperty({ example: '2026-03-05T17:00:00Z' })
  @IsDateString()
  scheduledEnd: string;

  @ApiPropertyOptional({ example: '2026-03-01T08:30:00Z' })
  @IsOptional()
  @IsDateString()
  actualStart?: string;

  @ApiPropertyOptional({ example: '2026-03-05T16:45:00Z' })
  @IsOptional()
  @IsDateString()
  actualEnd?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.NOT_STARTED })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 0, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: 'parent-task-uuid' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class CreateTaskDependencyDto {
  @ApiProperty({ example: 'task-uuid' })
  @IsUUID()
  taskId: string;

  @ApiProperty({ example: 'depends-on-task-uuid' })
  @IsUUID()
  dependsOnTaskId: string;

  @ApiPropertyOptional({
    enum: DependencyType,
    default: DependencyType.FINISH_TO_START,
  })
  @IsOptional()
  @IsEnum(DependencyType)
  type?: DependencyType;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  lag?: number;
}
