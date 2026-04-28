// mappers/task.mapper.ts
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';

export class TaskMapper {
  static toCreateEntity(
    dto: CreateTaskDto,
    planId: string,
    parentId?: string | null,
  ): Partial<Task> {
    // Convert dates
    const scheduledStart = new Date(dto.scheduledStart);
    const scheduledEnd = new Date(dto.scheduledEnd);

    // Validate dates
    if (scheduledStart >= scheduledEnd) {
      throw new BadRequestException(
        'Scheduled end date must be after start date',
      );
    }

    const actualStart = dto.actualStart ? new Date(dto.actualStart) : undefined;
    const actualEnd = dto.actualEnd ? new Date(dto.actualEnd) : undefined;

    // Return only the fields that should be persisted
    return {
      name: dto.name,
      jobDescription: dto.jobDescription,
      area: dto.area,
      department: dto.department,
      duration: dto.duration,
      plannedDuration: dto.plannedDuration,
      needPermits: dto.needPermits,
      status: dto.status,
      progress: dto.progress,
      planId,
      parentId: parentId ?? null,
      scheduledStart,
      scheduledEnd,
      actualStart,
      actualEnd,
    };
  }

  static toUpdateEntity(dto: UpdateTaskDto): Partial<Task> {
    const updateData: Partial<Task> = {};

    // Copy only allowed fields
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.jobDescription !== undefined)
      updateData.jobDescription = dto.jobDescription;
    if (dto.area !== undefined) updateData.area = dto.area;
    if (dto.department !== undefined) updateData.department = dto.department;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.plannedDuration !== undefined)
      updateData.plannedDuration = dto.plannedDuration;
    if (dto.needPermits !== undefined) updateData.needPermits = dto.needPermits;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.progress !== undefined) updateData.progress = dto.progress;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId;

    // Handle dates
    if (dto.scheduledStart) {
      updateData.scheduledStart = new Date(dto.scheduledStart);
    }
    if (dto.scheduledEnd) {
      updateData.scheduledEnd = new Date(dto.scheduledEnd);
    }
    if (dto.actualStart) {
      updateData.actualStart = new Date(dto.actualStart);
    }
    if (dto.actualEnd) {
      updateData.actualEnd = new Date(dto.actualEnd);
    }

    // Validate dates if both are present
    if (updateData.scheduledStart && updateData.scheduledEnd) {
      if (updateData.scheduledStart >= updateData.scheduledEnd) {
        throw new BadRequestException(
          'Scheduled end date must be after start date',
        );
      }
    }

    return updateData;
  }
}
