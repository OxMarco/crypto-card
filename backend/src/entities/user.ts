import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserEntity {
  // @ApiProperty()
  // @Expose()
  // id: string;

  @ApiProperty()
  @Expose()
  ethereumAddress: string;

  // @ApiPropertyOptional()
  // @Expose()
  // avatar?: string;

  // @ApiPropertyOptional()
  // @Expose()
  // firstName?: string;

  // @ApiPropertyOptional()
  // @Expose()
  // lastName?: string;

  // @ApiPropertyOptional()
  // @Expose()
  // phone?: string;

  // @ApiPropertyOptional()
  // @Expose()
  // email?: string;

  // @ApiProperty()
  // @Expose()
  // status: string;

  // @ApiProperty()
  // @Expose()
  // createdAt: number;
}
