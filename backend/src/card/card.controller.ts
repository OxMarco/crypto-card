import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CardEntity } from 'src/entities/card';
import { CreateCardDto } from 'src/dtos/create-card';

@Controller('card')
@ApiTags('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({
    status: 200,
    type: [CardService],
  })
  @Get()
  async getAll(): Promise<CardEntity[]> {
    return await this.cardService.getAll();
  }

  @ApiOperation({ summary: 'Get a specific card' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string): Promise<CardEntity> {
    return await this.cardService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new card for a certain user' })
  @ApiResponse({
    status: 200,
    type: CardEntity,
  })
  @Post()
  async createCard(@Body() createCardDto: CreateCardDto): Promise<CardEntity> {
    return await this.cardService.createCard(createCardDto);
  }
}
