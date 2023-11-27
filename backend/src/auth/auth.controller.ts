import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginUserDto } from 'src/dtos/login-user';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Perform login' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Post('login')
  async signIn(@Body() loginDto: LoginUserDto) {
    return await this.authService.login(loginDto.username, loginDto.password);
  }

  @ApiOperation({ summary: 'Return login status' })
  @ApiResponse({
    status: 200,
    type: 'object',
  })
  @UseGuards(AuthGuard)
  @Get('status')
  status() {
    return { status: true };
  }
}
