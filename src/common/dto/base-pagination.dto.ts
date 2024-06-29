import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationDto {
  @ApiProperty({ description: '페이지 번호, 기본값은 1', example: 1 })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID 보다 높은 ID부터 값을 가져오기
  // @Type(() => Number)
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  // 정렬
  // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  // 가져올 데이터의 개수
  @ApiProperty({
    description: '가져올 데이터의 개수, 기본값은 20',
    example: 12,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
