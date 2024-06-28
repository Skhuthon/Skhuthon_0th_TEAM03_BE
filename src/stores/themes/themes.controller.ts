import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ThemesService } from './themes.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody, ApiQuery,
} from '@nestjs/swagger';
import { CreateThemesDto } from './dto/create-themes.dto';
import { UpdateThemesDto } from './dto/update-themes.dto';
import { ThemesModel } from './entity/themes.entity';
import { PaginateThemesDto } from './dto/paginate-themes.dto';

@ApiTags('테마 관련 API')
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '테마명으로 페이지 기반 페이지네이션' })
  @ApiQuery({ name: 'page', description: '페이지 번호', required: true })
  @ApiResponse({ status: 200, description: '성공', type: [ThemesModel] })
  async findAll(@Query() query: PaginateThemesDto) {
    return await this.themesService.pagePaginateThemes(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 테마 조회' })
  @ApiParam({ name: 'id', description: '테마 ID' })
  @ApiResponse({ status: 200, description: '성공', type: ThemesModel })
  @ApiResponse({ status: 404, description: '테마를 찾을 수 없음' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.themesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '테마 생성' })
  @ApiBody({ type: CreateThemesDto })
  @ApiResponse({
    status: 201,
    description: '성공적으로 생성됨',
    type: ThemesModel,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async create(@Body() createThemeDto: CreateThemesDto) {
    return await this.themesService.create(createThemeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '특정 테마 수정' })
  @ApiParam({ name: 'id', description: '테마 ID' })
  @ApiBody({ type: UpdateThemesDto })
  @ApiResponse({ status: 200, description: '성공', type: ThemesModel })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '테마를 찾을 수 없음' })
  async update(
    @Param('themeId', ParseIntPipe) id: number,
    @Body() updateThemeDto: UpdateThemesDto,
  ) {
    return await this.themesService.update(id, updateThemeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '특정 테마 삭제' })
  @ApiParam({ name: 'id', description: '테마 ID' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '테마를 찾을 수 없음' })
  async remove(@Param('themeId') id: string) {
    return await this.themesService.remove(id);
  }
}
