import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DisputeEntity } from 'src/entities/dispute';
import { DisputeService } from './dispute.service';
import { MongooseClassSerializerInterceptor } from 'src/interceptors/mongoose';
import { PaginationInterceptor } from 'src/interceptors/pagination';

@Controller('dispute')
@ApiTags('dispute')
@MongooseClassSerializerInterceptor(DisputeEntity)
@UseInterceptors(PaginationInterceptor)
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @ApiOperation({ summary: 'Get all disputes' })
  @ApiResponse({
    status: 200,
    type: [DisputeEntity],
  })
  @Get()
  async getAll() {
    return await this.disputeService.getAll();
  }

  @ApiOperation({ summary: 'Get a specific dispute' })
  @ApiResponse({
    status: 200,
    type: DisputeEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string) {
    return await this.disputeService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 200,
    type: DisputeEntity,
  })
  @Post()
  async createDispute(@Body() createDisputeDto: any) {
    return await this.disputeService.create(createDisputeDto);
  }
}
