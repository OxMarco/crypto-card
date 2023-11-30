import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/dtos/login-user';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Perform login' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Post('login')
  signIn(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Return login status' })
  @ApiResponse({
    status: 200,
    type: 'object',
  })
  @Get('status')
  status() {
    return { status: true };
  }
}
