import { Controller, Get, Res, Header, Query, Post, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ENV_KAKAO_CLIENT_ID_KEY,
  ENV_KAKAO_REDIRECT_URL_KEY,
} from '../common/const/env-keys.const';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('인증 관련 API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '카카오 로그인 요청' })
  @ApiResponse({
    status: 302,
    description: '카카오 로그인 페이지로 리다이렉트',
  })
  @Get('kakao-login-page')
  @Header('Content-Type', 'text/html')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    const client_id = this.configService.get<string>(ENV_KAKAO_CLIENT_ID_KEY);
    const redirect_uri = this.configService.get<string>(
      ENV_KAKAO_REDIRECT_URL_KEY,
    );
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    res.redirect(url);
  }

  @ApiOperation({ summary: '카카오 로그인 리다이렉트' })
  @ApiResponse({ status: 200, description: '카카오 사용자 정보 조회 성공' })
  @ApiQuery({ name: 'code', required: true, description: '카카오 인증 코드' })
  @Post('kakao/redirect')
  async getKakaoInfo(@Param('code') code: string, @Res() res: Response) {
    const client_id = this.configService.get<string>(ENV_KAKAO_CLIENT_ID_KEY);
    const redirect_uri = this.configService.get<string>(
      ENV_KAKAO_REDIRECT_URL_KEY,
    );
    console.log(`code: ${code}`);
    await this.authService.kakaoLogin(client_id, redirect_uri, code, res);
  }
}
