import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['active', 'inactive', 'canceled'])
  status: string;
}
