import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import {
  type AuthenticatedUser,
  CurrentUser,
} from '../Auth/decorators/current-user.decorator';
import { PlanService } from './plan.service';
import { PlanStatus } from './enums/plan-status.enum';
import { PlanResponseDto } from './dto/plan-response.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanResponseDto,
  })
  async create(
    @Body() createPlanDto: CreatePlanDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.planService.create(createPlanDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PlanStatus })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: PlanStatus,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.planService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status,
      userId: user?.id,
    });
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get plans by status' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved by status',
    type: [PlanResponseDto],
  })
  async findByStatus(@Param('status') status: PlanStatus) {
    return this.planService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan found',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.planService.findOne(id);
  }

  @Get(':id/full')
  @ApiOperation({ summary: 'Get plan with full task hierarchy' })
  @ApiResponse({
    status: 200,
    description: 'Plan with tasks retrieved',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findOneWithTasks(@Param('id', ParseUUIDPipe) id: string) {
    return this.planService.findOneWithTasks(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get plan statistics and progress' })
  @ApiResponse({
    status: 200,
    description: 'Plan statistics retrieved',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async getStatistics(@Param('id', ParseUUIDPipe) id: string) {
    return this.planService.getStatistics(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.planService.update(id, updatePlanDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update plan status' })
  @ApiResponse({
    status: 200,
    description: 'Plan status updated',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: PlanStatus,
  ) {
    return this.planService.updateStatus(id, status);
  }

  @Patch(':id/recalculate-progress')
  @ApiOperation({ summary: 'Recalculate plan progress from tasks' })
  @ApiResponse({
    status: 200,
    description: 'Progress recalculated',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async recalculateProgress(@Param('id', ParseUUIDPipe) id: string) {
    const progress = await this.planService.recalculateProgress(id);
    return { progress };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.planService.remove(id);
    return { message: 'Plan deleted successfully' };
  }
}
