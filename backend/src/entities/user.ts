import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  cardholderId: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  wallet: string;

  @ApiProperty()
  @Expose()
  score: number;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;
}
