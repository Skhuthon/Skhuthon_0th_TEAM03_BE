import { PickType } from '@nestjs/swagger';
import { ThemesModel } from '../entity/themes.entity';
import { DifficultyEnum } from '../../../common/enum/difficulty.enum';

export class CreateThemesDto extends PickType(ThemesModel, [
  'title',
  'difficulty',
  'genre',
]) {
  title: string;
  difficulty: DifficultyEnum;
  genre: string;
}
