import { Plan } from '../modules/plan/entities/plan.entity';
import { PlanStatus } from '../modules/plan/enums/plan-status.enum';

export interface FindAllPlansOptions {
  page?: number;
  limit?: number;
  status?: PlanStatus;
  userId?: string;
}

export interface PaginatedPlansResponse {
  data: Plan[];
  total: number;
  page: number;
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PlanStatistics {
  plan: Plan;
  taskStats: TaskStats;
  progress: number;
}

export interface TaskStats {
  total: number;
  notStarted: number;
  started: number;
  inProgress: number;
  completed: number;
  postponed: number;
}
