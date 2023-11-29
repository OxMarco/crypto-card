import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  id: string;

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
