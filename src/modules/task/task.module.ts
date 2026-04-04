import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import {
  TaskController,
  PlanTaskController,
  DependencyController,
} from './task.controller';
import { TaskRepository } from './repositories/task.repository';
import { Task } from './entities/task.entity';
import { TaskDependency } from './entities/task-dependency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskDependency])],
  controllers: [TaskController, PlanTaskController, DependencyController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
