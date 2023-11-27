import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Return server status' })
  @ApiResponse({
    status: 200,
    type: 'object',
  })
  @Get()
  index() {
    return { message: 'ok', time: new Date().toISOString() };
  }
}
