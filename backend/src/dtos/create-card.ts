import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['physical', 'virtual'])
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['eur', 'usd'])
  currency: string;
}
