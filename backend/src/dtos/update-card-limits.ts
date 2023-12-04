import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateCardLimitsDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsPositive()
  monthlyLimit: number;

  @IsPositive()
  singleTxLimit: number;
}
