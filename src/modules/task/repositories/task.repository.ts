import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, IsNull } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskDependency } from '../entities/task-dependency.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskStats } from '@/types/plan.types';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: TreeRepository<Task>,

    @InjectRepository(TaskDependency)
    private readonly dependencyRepository: Repository<TaskDependency>,
  ) {}

  // ─── Task CRUD ───────────────────────────────────────────────────────────

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.repository.create(taskData);
    return this.repository.save(task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByIdWithSubtasks(id: string): Promise<Task | null> {
    const task = await this.repository.findOne({ where: { id } });
    return task ? this.repository.findDescendantsTree(task) : null;
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task | null> {
    await this.repository.update(id, taskData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // ─── Plan Tasks ──────────────────────────────────────────────────────────

  async findAllByPlanId(planId: string): Promise<Task[]> {
    return this.repository.find({
      where: { planId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Get all main tasks (no parent) for a plan with their subtasks
   */
  async findMainTasksWithSubtasks(planId: string): Promise<Task[]> {
    const mainTasks = await this.repository.find({
      where: {
        planId,
        parentId: IsNull(),
      },
      order: { createdAt: 'ASC' },
    });

    // Load subtasks for each main task
    const tasksWithSubtasks = await Promise.all(
      mainTasks.map(async (task) => {
        const descendants = await this.repository.findDescendantsTree(task);
        return descendants;
      }),
    );

    return tasksWithSubtasks;
  }

  /**
   * Get subtasks of a specific task
   */
  async findSubtasks(parentId: string): Promise<Task[]> {
    return this.repository.find({
      where: { parentId },
      order: { createdAt: 'ASC' },
    });
  }

  // ─── Dependencies ────────────────────────────────────────────────────────

  async createDependency(
    dependencyData: Partial<TaskDependency>,
  ): Promise<TaskDependency> {
    const dependency = this.dependencyRepository.create(dependencyData);
    return this.dependencyRepository.save(dependency);
  }

  async findDependencies(taskId: string): Promise<TaskDependency[]> {
    return this.dependencyRepository.find({
      where: { taskId },
      relations: ['dependsOnTask'],
    });
  }

  async deleteDependency(id: string): Promise<boolean> {
    const result = await this.dependencyRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // ─── Statistics & Calculations ───────────────────────────────────────────

  /**
   * Calculate plan progress based on tasks
   */
  async calculatePlanProgress(planId: string): Promise<number> {
    const tasks = await this.repository.find({
      where: { planId, parentId: IsNull() }, // Only main tasks
    });

    if (tasks.length === 0) return 0;

    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  }

  /**
   * Update task progress and propagate to parent
   */
  async updateProgress(id: string, progress: number): Promise<void> {
    await this.repository.update(id, { progress });

    // Get task to check if it has a parent
    const task = await this.findById(id);
    if (task?.parentId) {
      // Recalculate parent progress
      await this.recalculateParentProgress(task.parentId);
    }
  }

  /**
   * Recalculate parent task progress based on subtasks
   */
  async recalculateParentProgress(parentId: string): Promise<void> {
    const subtasks = await this.findSubtasks(parentId);

    if (subtasks.length === 0) return;

    const totalProgress = subtasks.reduce(
      (sum, task) => sum + task.progress,
      0,
    );
    const averageProgress = Math.round(totalProgress / subtasks.length);

    await this.repository.update(parentId, { progress: averageProgress });

    // Check if parent also has a parent (recursive)
    const parent = await this.findById(parentId);
    if (parent?.parentId) {
      await this.recalculateParentProgress(parent.parentId);
    }
  }

  /**
   * Get task count by status for a plan
   */
  async getTaskStatsByPlan(planId: string): Promise<TaskStats> {
    const tasks = await this.findAllByPlanId(planId);

    return {
      total: tasks.length,
      started: tasks.filter((t) => t.status === TaskStatus.STARTED).length,
      notStarted: tasks.filter((t) => t.status === TaskStatus.NOT_STARTED)
        .length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)
        .length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      postponed: tasks.filter((t) => t.status === TaskStatus.POSTPONED).length,
    };
  }
}
