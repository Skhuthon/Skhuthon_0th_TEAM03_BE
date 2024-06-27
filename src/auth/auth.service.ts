import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ENV_JWT_SECRET_KEY } from '../common/const/env-keys.const';
import { UsersModel } from '../users/entity/users.entity';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}
  extractTokenFromHeader(header: string) {
    const splitToken = header.split(' ');

    const prefix = 'Bearer';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    const token = splitToken[1];
    return token;
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.');
    }
  }
  signToken(user: Pick<UsersModel, 'email' | 'id'>) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      // 1 year
      expiresIn: '365d',
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    const accessToken = this.signToken(user);
    return {
      accessToken,
    };
  }
  async kakaoLogin(client_id: string, redirect_uri: string, code: string) {
    const config = {
      grant_type: 'authorization_code',
      client_id,
      redirect_uri,
      code,
    };
    const params = new URLSearchParams(config).toString();
    const tokenHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const tokenUrl = `https://kauth.kakao.com/oauth/token`;

    try {
      // 토큰을 받아온다.
      const res = await firstValueFrom(
        this.http.post(tokenUrl, params, { headers: tokenHeaders }),
      );
      console.log(res.data);
      // 받아온 토큰으로 사용자 정보를 가져온다.
      const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      const userInfoHeaders = {
        Authorization: `Bearer ${res.data.access_token}`,
      };
      const { data } = await firstValueFrom(
        this.http.get(userInfoUrl, { headers: userInfoHeaders }),
      );
      console.log(data.kakao_account.email);
    } catch (e) {
      console.error('Error during Kakao login:', e);
    }
  }
}
