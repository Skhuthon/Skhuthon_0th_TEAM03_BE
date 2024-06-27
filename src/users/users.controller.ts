import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('사용자 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 생성 API',
    description: '사용자를 생성합니다.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    schema: {
      example: {
        id: 1,
        name: '홍길동',
        email: 'hong@example.com',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  @Post('register')
  async postUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}
