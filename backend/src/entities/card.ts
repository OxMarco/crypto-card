import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CardEntity {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  cardholderId: string;

  @ApiProperty()
  @Expose()
  currency: string;

  @ApiProperty()
  @Expose()
  expMonth: number;

  @ApiProperty()
  @Expose()
  expYear: number;

  @ApiProperty()
  @Expose()
  last4: string;

  @ApiProperty()
  @Expose()
  brand: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  createdAt: number;
}
