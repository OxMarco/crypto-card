import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCardStatusDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['active', 'inactive', 'canceled'])
  status: string;
}
