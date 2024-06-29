import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { stringValidationMessage } from '../../../common/validation-message/string-validation-message';

export class SearchThemesDto {
  @ApiProperty({ description: '지역', example: '서울 전체' })
  @IsString({
    message: stringValidationMessage,
  })
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: '테마명', example: '오늘 나는' })
  @IsString({
    message: stringValidationMessage,
  })
  @IsNotEmpty()
  title: string;
}
