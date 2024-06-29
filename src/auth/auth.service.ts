import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ENV_JWT_SECRET_KEY } from '../common/const/env-keys.const';
import { UsersModel } from '../users/entity/users.entity';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  private readonly BEARER_PREFIX = 'Bearer';
  private readonly JWT_EXPIRATION = '365d';
  private readonly KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private readonly KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

  extractTokenFromHeader(header: string) {
    const splitToken = header.split(' ');

    if (splitToken.length !== 2 || splitToken[0] !== this.BEARER_PREFIX) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    return splitToken[1];
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
      expiresIn: this.JWT_EXPIRATION,
    });
  }

  async registerUser(email: string, nickname: string) {
    const createUserDto = new CreateUserDto();
    createUserDto.email = email;
    createUserDto.nickname = nickname;
    return this.usersService.createUser(createUserDto);
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>, res: Response) {
    const accessToken = this.signToken(user);
    res.redirect(
      `http://localhost:3000/auth/kakao/redirect?accessToken=${accessToken}`,
    );
  }

  async kakaoLogin(
    client_id: string,
    redirect_uri: string,
    code: string,
    res: Response,
  ) {
    const config = {
      grant_type: 'authorization_code',
      client_id,
      redirect_uri,
      code,
    };
    const params = new URLSearchParams(config).toString();
    console.log('params:', params);
    const tokenHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      // 토큰을 받아온다.
      const tokenResponse = await firstValueFrom(
        this.http.post(this.KAKAO_TOKEN_URL, params, { headers: tokenHeaders }),
      );
      const { access_token } = tokenResponse.data;
      console.log('access_token:', access_token);

      // 받아온 토큰으로 사용자 정보를 가져온다.
      const userInfoHeaders = {
        Authorization: `Bearer ${access_token}`,
      };
      const { data } = await firstValueFrom(
        this.http.get(this.KAKAO_USER_INFO_URL, { headers: userInfoHeaders }),
      );

      const nickname = data.properties.nickname;
      const email = data.kakao_account.email;
      console.log('email:', email);
      console.log('nickname:', nickname);
      if (!email || !nickname) {
        throw new UnauthorizedException('사용자의 정보를 가져올 수 없습니다.');
      }

      // 사용자 정보를 이용해서 로그인
      let user = await this.usersService.findUserByEmail(email);

      // 사용자 정보가 없으면 회원가입
      if (!user) {
        user = await this.registerUser(email, nickname);
        return this.loginUser(user, res);
      }
      // 로그인
      return this.loginUser(user, res);
    } catch (e) {
      console.error('Error during Kakao login:', e);
      throw new UnauthorizedException('카카오 로그인 중 오류가 발생했습니다.');
    }
  }
}
