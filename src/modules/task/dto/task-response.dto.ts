import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planId: string;

  @ApiPropertyOptional()
  parentId: string | null;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  jobDescription?: string;

  @ApiPropertyOptional()
  area?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  plannedDuration?: string;

  @ApiPropertyOptional()
  needPermits?: boolean;

  @ApiProperty()
  scheduledStart: Date;

  @ApiProperty()
  scheduledEnd: Date;

  @ApiPropertyOptional()
  actualStart?: Date;

  @ApiPropertyOptional()
  actualEnd?: Date;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  progress: number;

  @ApiPropertyOptional({ type: () => [TaskResponseDto] })
  subtasks?: TaskResponseDto[];

  @ApiPropertyOptional()
  dependencies?: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
