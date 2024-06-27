import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('서버 상태 체크')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '서버 상태 체크' })
  @ApiResponse({ status: 200, description: '서버 정상 동작' })
  @Get('health')
  health(): boolean {
    return true;
  }
}
