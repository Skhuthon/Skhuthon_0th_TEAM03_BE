import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ENV_NAVER_CALLBACK_URL_KEY,
  ENV_NAVER_CLIENT_ID_KEY,
  ENV_NAVER_CLIENT_SECRET_KEY,
} from '../../common/const/env-keys.const';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>(ENV_NAVER_CLIENT_ID_KEY),
      clientSecret: configService.get<string>(ENV_NAVER_CLIENT_SECRET_KEY),
      callbackURL: configService.get<string>(ENV_NAVER_CALLBACK_URL_KEY),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log(profile);
    const id = profile.id;
    const email = profile.email;
    const name = profile.name;
    const user = {
      id,
      email,
      name,
    };

    return user;
  }
}
