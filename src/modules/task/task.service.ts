import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { Task } from './entities/task.entity';
import { TaskDependency } from './entities/task-dependency.entity';
import { CreateTaskDependencyDto, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { TaskMapper } from './mappers/task.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../plan/entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  /**
   * Create a main task (no parent)
   */
  async create(planId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    // Verify plan exists
    const plan = await this.planRepository.findBy({ id: planId });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    const taskData = TaskMapper.toCreateEntity(createTaskDto, planId);
    const task = await this.taskRepository.create(taskData);

    // Recalculate plan progress
    await this.recalculatePlanProgress(planId);

    return task;
  }

  /**
   * Create a subtask
   */
  async createSubtask(
    parentId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    // Verify parent task exists
    const parent = await this.taskRepository.findById(parentId);
    if (!parent) {
      throw new NotFoundException(`Parent task with ID ${parentId} not found`);
    }

    const taskData = TaskMapper.toCreateEntity(
      createTaskDto,
      parent.planId,
      parentId,
    );
    const task = await this.taskRepository.create(taskData);

    // Recalculate parent progress
    await this.taskRepository.recalculateParentProgress(parentId);

    // Recalculate plan progress
    await this.recalculatePlanProgress(parent.planId);

    return task;
  }

  /**
   * Get all tasks for a plan (flat list)
   */
  async findAllByPlan(planId: string): Promise<Task[]> {
    return this.taskRepository.findAllByPlanId(planId);
  }

  /**
   * Get main tasks with their subtasks (tree structure)
   */
  async findMainTasksWithSubtasks(planId: string): Promise<Task[]> {
    return this.taskRepository.findMainTasksWithSubtasks(planId);
  }

  /**
   * Get a single task by ID
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Get task with all subtasks (tree)
   */
  async findOneWithSubtasks(id: string): Promise<Task> {
    const task = await this.taskRepository.findByIdWithSubtasks(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Get subtasks of a task
   */
  async findSubtasks(parentId: string): Promise<Task[]> {
    return this.taskRepository.findSubtasks(parentId);
  }

  /**
   * Update a task
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updateData = TaskMapper.toUpdateEntity(updateTaskDto);

    const updatedTask = await this.taskRepository.update(id, updateData);

    return updatedTask!;
  }

  /**
   * Delete a task (cascades to subtasks)
   */
  async remove(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new BadRequestException('Failed to delete task');
    }

    // Recalculate plan progress
    await this.recalculatePlanProgress(task.planId);
  }

  /**
   * Update task progress (auto-propagates to parent and plan)
   */
  async updateProgress(id: string, progress: number): Promise<Task> {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Update progress (this auto-propagates to parent)
    await this.taskRepository.updateProgress(id, progress);

    // Recalculate plan progress
    await this.recalculatePlanProgress(task.planId);

    return this.findOne(id);
  }

  /**
   * Update task status
   */
  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.update(id, { status });
  }

  // ─── Dependencies ────────────────────────────────────────────────────────

  /**
   * Create a task dependency
   */
  async createDependency(
    createDependencyDto: CreateTaskDependencyDto,
  ): Promise<TaskDependency> {
    const { taskId, dependsOnTaskId } = createDependencyDto;

    // Verify both tasks exist
    const task = await this.taskRepository.findById(taskId);
    const dependsOnTask = await this.taskRepository.findById(dependsOnTaskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (!dependsOnTask) {
      throw new NotFoundException(`Task with ID ${dependsOnTaskId} not found`);
    }

    // Prevent task depending on itself
    if (taskId === dependsOnTaskId) {
      throw new BadRequestException('Task cannot depend on itself');
    }

    // TODO: Check for circular dependencies

    return this.taskRepository.createDependency(createDependencyDto);
  }

  /**
   * Get task dependencies
   */
  async findDependencies(taskId: string): Promise<TaskDependency[]> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return this.taskRepository.findDependencies(taskId);
  }

  /**
   * Remove a dependency
   */
  async removeDependency(id: string): Promise<void> {
    const deleted = await this.taskRepository.deleteDependency(id);

    if (!deleted) {
      throw new NotFoundException(`Dependency with ID ${id} not found`);
    }
  }

  // ─── Helper Methods ──────────────────────────────────────────────────────

  private validateDates(start: Date, end: Date): void {
    if (start >= end) {
      throw new BadRequestException(
        'Scheduled end date must be after start date',
      );
    }
  }

  private async recalculatePlanProgress(planId: string): Promise<void> {
    const progress = await this.taskRepository.calculatePlanProgress(planId);
    await this.planRepository.update(planId, { progress });
  }
}
