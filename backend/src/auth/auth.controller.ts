import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/dtos/login-user';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Get login nonce' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Public()
  @Get(':wallet')
  async nonce(@Param('wallet') wallet: string) {
    const nonce = await this.authService.generateNonce(wallet);
    return { nonce: nonce };
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Public()
  @Post('login')
  async signIn(@Body() loginDto: LoginUserDto) {
    return await this.authService.login(loginDto);
  }
}
