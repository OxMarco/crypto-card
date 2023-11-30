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
import { UpdateCardDto } from 'src/dtos/update-card';

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

  @ApiOperation({ summary: 'Create a new card for a certain user' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Put()
  async updateCard(@Body() updateCardDto: UpdateCardDto, @Req() req: Request) {
    const cardholderId: string = (req as any).cardholderId;
    return await this.cardService.updateCard(cardholderId, updateCardDto);
  }
}
