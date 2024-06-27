import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Get,
  Res,
  Header, Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import {
  ENV_KAKAO_CLIENT_ID_KEY,
  ENV_KAKAO_REDIRECT_URL_KEY,
} from '../common/const/env-keys.const';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('인증 관련 API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '카카오 로그인' })
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
  @Get('kakao/redirect')
  async getKakaoInfo(@Query() code: string) {
    console.log(code);
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);
    /**
     * {accessToken: {token}}
     */
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);
    /**
     * {refreshToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  // 로그인
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials);
  }

  // 회원가입
  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }
}
