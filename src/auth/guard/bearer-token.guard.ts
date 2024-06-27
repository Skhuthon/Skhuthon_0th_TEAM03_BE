
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { CommonService } from '../../common/common.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorator/is-public.decorator';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService,
              private readonly reflect: Reflector,) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflect.getAllAndOverride(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]
    );


    const req = context.switchToHttp().getRequest();
    if(isPublic) {
      req.isRoutePublic = true;
      return true;
    }

    const rawToken = req.headers['authorization'];
    if(!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = await this.authService.verifyToken(token);
    /**
     * result 안에 토큰의 payload가 들어있다.
     *
     * requeest 객체에 넣을 정보
     * 1) 사용자 정보 - user
     * 2) token - 받아온 토큰값
     * 3) tokenType - access | refresh
     */
    const user = await this.usersService.getUserByEmail(result.email);

    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if(req.isRoutePublic){
      return true;
    }

    if(req.tokenType !== 'access') {
      throw new UnauthorizedException('Access Token이 아닙니다.');
    }
    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {

    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if(req.isRoutePublic){
      return true;
    }

    if(req.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh Token이 아닙니다.');
    }
    return true;
  }
}
