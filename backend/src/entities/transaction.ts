import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransactionEntity {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  cardId: string;

  @ApiProperty()
  @Expose()
  cardholderId: string;

  @ApiProperty()
  @Expose()
  currency: string;

  @ApiProperty()
  @Expose()
  merchantAmount: number;

  @ApiProperty()
  @Expose()
  merchantCurrency: string;

  @ApiProperty()
  @Expose()
  merchant: any;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  createdAt: number;
}
