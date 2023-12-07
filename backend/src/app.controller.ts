import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Return server status' })
  @ApiResponse({
    status: 200,
    type: 'object',
  })
  @Public()
  @Get()
  index() {
    return { message: 'ok', time: new Date().toISOString() };
  }
}
