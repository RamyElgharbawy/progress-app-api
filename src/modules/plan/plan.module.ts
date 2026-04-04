import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PlanRepository } from './repositories/plan.repository';
import { Plan } from './entities/plan.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    TaskModule, // Import TaskModule to access TaskRepository
  ],
  controllers: [PlanController],
  providers: [PlanService, PlanRepository],
  exports: [PlanService, PlanRepository],
})
export class PlanModule {}
