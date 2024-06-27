import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from '../common/const/env-keys.const';
import { UsersModel } from '../users/entity/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import bcrypt from 'bcrypt';
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
  extractTokenFromHeader(header: string, isBearer: boolean) {
    // 'Basic {token}' -> ['Basic', '{token}']
    // 'Bearer {token}' -> ['Bearer', '{token}']
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    const token = splitToken[1];
    return token;
  }
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
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
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh 토큰으로만 가능합니다.',
      );
    }
    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      // seconds
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);
    return {
      accessToken,
      refreshToken,
    };
  }
  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    // 1) email이 존재하는지
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const passOk: boolean = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    // 3) 모두 통과되면 유저 정보를 반환한다.
    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  async registerWithEmail(user: RegisterUserDto) {
    /**
     * 파라미터
     *
     * 1) 입력된 비밀번호
     * 2) 해쉬 라운드 -> 10 라운드
     * salt는 자동 생성
     */
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    );
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
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
    const tokenUrl = `https://kauth.kakao.com/oauth/token?${params}`;

    const res = await firstValueFrom(
      this.http.post(tokenUrl, '', { headers: tokenHeaders }),
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
    console.log(data);
  }
}
