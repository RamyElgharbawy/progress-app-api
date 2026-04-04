import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { PlanStatus } from '../enums/plan-status.enum';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(Plan)
    private readonly repository: Repository<Plan>,
  ) {}

  async create(planData: Partial<Plan>): Promise<Plan> {
    const plan = this.repository.create(planData);
    return this.repository.save(plan);
  }

  async findAll(options?: {
    status?: PlanStatus;
    createdBy?: string;
  }): Promise<Plan[]> {
    const where: FindOptionsWhere<Plan> = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.createdBy) {
      where.createdBy = options.createdBy;
    }

    return this.repository.find({
      where,
      relations: ['tasks'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(id: string, withTasks = false): Promise<Plan | null> {
    const relations = withTasks ? ['tasks'] : [];

    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByIdWithFullHierarchy(id: string): Promise<Plan | null> {
    // Get plan with all tasks in tree structure
    return this.repository.findOne({
      where: { id },
      relations: ['tasks', 'tasks.subtasks'],
    });
  }

  async update(id: string, planData: Partial<Plan>): Promise<Plan | null> {
    await this.repository.update(id, planData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async updateProgress(id: string, progress: number): Promise<void> {
    await this.repository.update(id, { progress });
  }

  async count(options?: { status?: PlanStatus }): Promise<number> {
    const where: FindOptionsWhere<Plan> = {};

    if (options?.status) {
      where.status = options.status;
    }

    return this.repository.count({ where });
  }

  async findWithPagination(options: {
    page: number;
    limit: number;
    status?: PlanStatus;
  }): Promise<{ data: Plan[]; total: number; page: number; limit: number }> {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Plan> = {};
    if (status) {
      where.status = status;
    }

    const [data, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['tasks'],
      order: { updatedAt: 'DESC' },
    });

    return { data, total, page, limit };
  }
}
