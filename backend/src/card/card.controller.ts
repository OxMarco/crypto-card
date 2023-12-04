import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CardService } from './card.service';
import { CardEntity } from 'src/entities/card';
import { CreateCardDto } from 'src/dtos/create-card';
import { MongooseClassSerializerInterceptor } from 'src/interceptors/mongoose';
import { PaginationInterceptor } from 'src/interceptors/pagination';
import { UpdateCardStatusDto } from 'src/dtos/update-card-status';
import { UpdateCardLimitsDto } from 'src/dtos/update-card-limits';

@Controller('card')
@UseInterceptors(PaginationInterceptor)
@ApiTags('card')
@MongooseClassSerializerInterceptor(CardEntity)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({
    status: 200,
    type: [CardEntity],
  })
  @Get()
  async getAll(@Req() req: Request) {
    const cardholderId: string = (req as any).cardholderId;
    return await this.cardService.getAll(cardholderId);
  }

  @ApiOperation({ summary: 'Get a specific card' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string) {
    return await this.cardService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new card for a certain user' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Post()
  async createCard(@Body() createCardDto: CreateCardDto, @Req() req: Request) {
    const cardholderId: string = (req as any).cardholderId;
    return await this.cardService.createCard(cardholderId, createCardDto);
  }

  @ApiOperation({ summary: 'Update card status' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Put('/status')
  async updateCardStatus(
    @Body() updateCardStatusDto: UpdateCardStatusDto,
    @Req() req: Request,
  ) {
    const cardholderId: string = (req as any).cardholderId;
    return await this.cardService.updateCardStatus(
      cardholderId,
      updateCardStatusDto,
    );
  }

  @ApiOperation({ summary: 'Update card limits' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Put('/limits')
  async updateCardLimits(
    @Body() updateCardLimitsDto: UpdateCardLimitsDto,
    @Req() req: Request,
  ) {
    const cardholderId: string = (req as any).cardholderId;
    return await this.cardService.updateCardLimits(
      cardholderId,
      updateCardLimitsDto,
    );
  }
}
