import { BasePaginationDto } from '../../../common/dto/base-pagination.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateThemesDto extends BasePaginationDto {
  @ApiProperty({ description: '테마명', example: '베스', required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: '지역', example: '홍대', required: false })
  @IsString()
  @IsOptional()
  region: string;
}
