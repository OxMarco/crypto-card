import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from 'src/entities/transaction';
import { Request, Response } from 'express';
import { MongooseClassSerializerInterceptor } from 'src/interceptors/mongoose';
import { PaginationInterceptor } from 'src/interceptors/pagination';

@Controller('transaction')
@ApiTags('transaction')
@MongooseClassSerializerInterceptor(TransactionEntity)
@UseInterceptors(PaginationInterceptor)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    type: [TransactionEntity],
  })
  @Get()
  async getAll() {
    return await this.transactionService.getAll();
  }

  @ApiOperation({ summary: 'Get a specific transaction' })
  @ApiResponse({
    status: 200,
    type: TransactionEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string) {
    return await this.transactionService.getById(id);
  }

  @Post('/webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @Res() response: Response,
  ) {
    try {
      const status = await this.transactionService.handleWebhook(
        req.rawBody,
        signature,
      );
      response.status(200).json({ approved: status });
    } catch (error) {
      response.status(400).send(error.message);
    }
  }
}
