import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    // 네이버 로그인 페이지로 리다이렉트
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req) {
    // 네이버 로그인 후 콜백 처리
    return req.user;
  }
}
