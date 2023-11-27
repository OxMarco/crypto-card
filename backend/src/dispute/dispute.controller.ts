import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DisputeEntity } from 'src/entities/dispute';
import { DisputeService } from './dispute.service';

@Controller('dispute')
@ApiTags('dispute')
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @ApiOperation({ summary: 'Get all disputes' })
  @ApiResponse({
    status: 200,
    type: [DisputeEntity],
  })
  @Get()
  async getAll(): Promise<DisputeEntity[]> {
    return await this.disputeService.getAll();
  }

  @ApiOperation({ summary: 'Get a specific dispute' })
  @ApiResponse({
    status: 200,
    type: DisputeEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string): Promise<DisputeEntity> {
    return await this.disputeService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 200,
    type: DisputeEntity,
  })
  @Post()
  async createDispute(@Body() createDisputeDto: any): Promise<DisputeEntity> {
    return await this.disputeService.create(createDisputeDto);
  }
}
