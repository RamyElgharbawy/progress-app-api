import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Plan } from '../../plan/entities/plan.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskDependency } from './task-dependency.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'plan_id' })
  planId!: string;

  @ManyToOne(() => Plan, (plan) => plan.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan!: Plan;

  // Self-referencing for parent-child relationship
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId!: string | null;

  @ManyToOne(() => Task, (task) => task.subtasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: Task | null;

  @OneToMany(() => Task, (task) => task.parent)
  subtasks!: Task[]; // TODO: test delete main task with subtasks after run migration

  // Task dependencies - tasks that this task depends on
  @OneToMany(() => TaskDependency, (dependency) => dependency.task)
  dependencies!: TaskDependency[];

  @Column({ length: 255 })
  name!: string;

  @Column({ name: 'job_description', type: 'text', nullable: true })
  jobDescription!: string;

  @Column({ length: 100, nullable: true })
  area!: string;

  @Column({ length: 100, nullable: true })
  department!: string;

  @Column({ type: 'int', nullable: true })
  duration!: number;

  @Column({ name: 'planned_duration', length: 50, nullable: true })
  plannedDuration!: string; // e.g., "8 hours"

  @Column({ name: 'need_permits', default: false })
  needPermits!: boolean;

  // Scheduling
  @Column({ name: 'scheduled_start', type: 'timestamp' })
  scheduledStart!: Date;

  @Column({ name: 'scheduled_end', type: 'timestamp' })
  scheduledEnd!: Date;

  @Column({ name: 'actual_start', type: 'timestamp', nullable: true })
  actualStart!: Date | null;

  @Column({ name: 'actual_end', type: 'timestamp', nullable: true })
  actualEnd!: Date | null;

  // Status & Progress
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status!: TaskStatus;

  @Column({ type: 'int', default: 0 })
  progress!: number; // 0-100

  // For UI state (not persisted in DB - transient)
  isExpanded?: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper method to check if this is a main task (no parent)
  get isMainTask(): boolean {
    return this.parentId === null;
  }

  // Helper method to check if this is a subtask
  get isSubtask(): boolean {
    return this.parentId !== null;
  }
}
