import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Get,
  Res,
  Header,
  Query,
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
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

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
  @Get('kakao/redirect')
  async getKakaoInfo(@Query('code') code: string) {
    const client_id = this.configService.get<string>(ENV_KAKAO_CLIENT_ID_KEY);
    const redirect_uri = this.configService.get<string>(
      ENV_KAKAO_REDIRECT_URL_KEY,
    );
    await this.authService.kakaoLogin(client_id, redirect_uri, code);
  }

  @ApiOperation({ summary: '엑세스 토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '엑세스 토큰 갱신 성공',
    schema: { example: { accessToken: 'newAccessToken' } },
  })
  @ApiHeader({
    name: 'authorization',
    required: true,
    description: 'Bearer 리프레시 토큰',
  })
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

  @ApiOperation({ summary: '리프레시 토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '리프레시 토큰 갱신 성공',
    schema: { example: { refreshToken: 'newRefreshToken' } },
  })
  @ApiHeader({
    name: 'authorization',
    required: true,
    description: 'Bearer 리프레시 토큰',
  })
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

  @ApiOperation({ summary: '이메일 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      example: { accessToken: 'accessToken', refreshToken: 'refreshToken' },
    },
  })
  @ApiHeader({
    name: 'authorization',
    required: true,
    description: 'Basic 인증 토큰',
  })
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials);
  }

  @ApiOperation({ summary: '이메일 회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: { example: { message: 'User registered successfully' } },
  })
  @ApiBody({ type: RegisterUserDto })
  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }
}
