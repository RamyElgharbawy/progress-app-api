import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlanRepository } from './repositories/plan.repository';
import { TaskRepository } from '../task/repositories/task.repository';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './entities/plan.entity';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanStatus } from './enums/plan-status.enum';
import {
  FindAllPlansOptions,
  PaginatedPlansResponse,
  PlanStatistics,
} from '@/types/plan.types';

@Injectable()
export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  /**
   * Create a new plan
   */
  async create(createPlanDto: CreatePlanDto, userId: string): Promise<Plan> {
    const plan = await this.planRepository.create({
      ...createPlanDto,
      createdBy: userId,
    });

    return plan;
  }

  /**
   * Get all plans with optional filters
   */
  async findAll(
    options?: FindAllPlansOptions,
  ): Promise<PaginatedPlansResponse> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    if (page && limit) {
      return this.planRepository.findWithPagination({
        page,
        limit,
        status: options?.status,
      });
    }

    const plans = await this.planRepository.findAll({
      status: options?.status,
      createdBy: options?.userId,
    });

    return {
      data: plans,
      total: plans.length,
      page: 1,
      limit: plans.length,
    };
  }

  /**
   * Get a single plan by ID
   */
  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  /**
   * Get plan with full task hierarchy
   */
  async findOneWithTasks(id: string): Promise<Plan> {
    const plan = await this.planRepository.findByIdWithFullHierarchy(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  /**
   * Update a plan
   */
  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    const updatedPlan = await this.planRepository.update(id, updatePlanDto);

    return updatedPlan!;
  }

  /**
   * Delete a plan (cascades to tasks)
   */
  async remove(id: string): Promise<void> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    const deleted = await this.planRepository.delete(id);

    if (!deleted) {
      throw new BadRequestException('Failed to delete plan');
    }
  }

  /**
   * Recalculate and update plan progress based on tasks
   */
  async recalculateProgress(planId: string): Promise<number> {
    const plan = await this.planRepository.findById(planId);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    try {
      const progress = await this.taskRepository.calculatePlanProgress(planId);
      await this.planRepository.updateProgress(planId, progress);

      return progress;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to recalculate plan progress',
        error,
      );
    }
  }

  /**
   * Get plan statistics
   */
  async getStatistics(id: string): Promise<PlanStatistics> {
    try {
      const plan = await this.findOne(id);
      const taskStats = await this.taskRepository.getTaskStatsByPlan(id);
      const progress = await this.recalculateProgress(id);

      return {
        plan,
        taskStats,
        progress,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get plan statistics');
    }
  }

  /**
   * Change plan status
   */
  async updateStatus(id: string, status: PlanStatus): Promise<Plan> {
    return this.update(id, { status });
  }

  /**
   * Get plans by status
   */
  async findByStatus(status: PlanStatus): Promise<Plan[]> {
    const result = await this.planRepository.findAll({ status });
    return result;
  }
}
