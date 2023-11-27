import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  phone?: string;
}
