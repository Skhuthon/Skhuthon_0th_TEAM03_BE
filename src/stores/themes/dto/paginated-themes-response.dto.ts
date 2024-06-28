import { ThemesModel } from '../entity/themes.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedThemesResponseDto {
  @ApiProperty({ description: '테마 목록', type: [ThemesModel] })
  data: ThemesModel[];

  @ApiProperty({ description: '검색된 테마의 수' })
  total: number;
}
