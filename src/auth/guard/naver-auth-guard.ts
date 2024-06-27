import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class NaverAuthGuard extends AuthGuard('naver') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    //에러가 존재하면 에러 처리로 넘긴다.
    if (err || !user) {
      throw err;
    }
    return user;
  }
}
