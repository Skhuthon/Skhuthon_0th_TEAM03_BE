import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DifficultyEnum } from '../../../common/enum/difficulty.enum';
import { stringValidationMessage } from '../../../common/validation-message/string-validation-message';

export class SuggestThemesDto {
  @ApiProperty({ description: '테마명', example: '그림자 없는 상자' })
  @IsString({
    message: '테마명은 문자열이어야 합니다.',
  })
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ description: '지역', example: '서울 전체' })
  @IsString({
    message: stringValidationMessage,
  })
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: '난이도', example: '쉬움' })
  @IsNotEmpty()
  difficulty: DifficultyEnum;
}
