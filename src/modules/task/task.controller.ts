import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateTaskDependencyDto, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // ─── Task CRUD ───────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task found',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(id);
  }

  @Get(':id/subtasks')
  @ApiOperation({ summary: 'Get task with all subtasks (tree structure)' })
  @ApiResponse({
    status: 200,
    description: 'Task with subtasks retrieved',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOneWithSubtasks(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOneWithSubtasks(id);
  }

  @Post(':id/subtasks')
  @ApiOperation({ summary: 'Create a subtask' })
  @ApiResponse({
    status: 201,
    description: 'Subtask created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Parent task not found' })
  async createSubtask(
    @Param('id', ParseUUIDPipe) parentId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.createSubtask(parentId, createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update task progress' })
  @ApiResponse({
    status: 200,
    description: 'Progress updated (auto-propagates to parent and plan)',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('progress') progress: number,
  ) {
    return this.taskService.updateProgress(id, progress);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({
    status: 200,
    description: 'Status updated',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: TaskStatus,
  ) {
    return this.taskService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (cascades to subtasks)' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.taskService.remove(id);
    return { message: 'Task deleted successfully' };
  }

  // ─── Dependencies ────────────────────────────────────────────────────────

  @Post(':id/dependencies')
  @ApiOperation({ summary: 'Create a task dependency' })
  @ApiResponse({
    status: 201,
    description: 'Dependency created successfully',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async createDependency(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() createDependencyDto: CreateTaskDependencyDto,
  ) {
    // Override taskId from param
    return this.taskService.createDependency({
      ...createDependencyDto,
      taskId,
    });
  }

  @Get(':id/dependencies')
  @ApiOperation({ summary: 'Get task dependencies' })
  @ApiResponse({
    status: 200,
    description: 'Dependencies retrieved',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findDependencies(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findDependencies(id);
  }
}

// ─── Plan-scoped Task Controller ────────────────────────────────────────────

@ApiTags('Plans')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('plans/:planId/tasks')
export class PlanTaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a main task in a plan' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async create(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(planId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for a plan (tree structure)' })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved with hierarchy',
  })
  async findAllWithHierarchy(@Param('planId', ParseUUIDPipe) planId: string) {
    return this.taskService.findMainTasksWithSubtasks(planId);
  }

  @Get('flat')
  @ApiOperation({ summary: 'Get all tasks for a plan (flat list)' })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved as flat list',
  })
  async findAllFlat(@Param('planId', ParseUUIDPipe) planId: string) {
    return this.taskService.findAllByPlan(planId);
  }
}

// ─── Dependency Controller ──────────────────────────────────────────────────

@ApiTags('Task Dependencies')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dependencies')
export class DependencyController {
  constructor(private readonly taskService: TaskService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task dependency' })
  @ApiResponse({
    status: 200,
    description: 'Dependency deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Dependency not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.taskService.removeDependency(id);
    return { message: 'Dependency deleted successfully' };
  }
}
