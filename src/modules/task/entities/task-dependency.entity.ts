import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { DependencyType } from '../enums/dependency-type.enum';

@Entity('task_dependencies')
export class TaskDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id' })
  taskId: string;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'depends_on_task_id' })
  dependsOnTaskId: string;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'depends_on_task_id' })
  dependsOnTask: Task;

  @Column({
    type: 'enum',
    enum: DependencyType,
    default: DependencyType.FINISH_TO_START,
  })
  type: DependencyType;

  @Column({ type: 'int', default: 0 })
  lag: number; // Lag time in days

  @CreateDateColumn()
  createdAt: Date;
}
