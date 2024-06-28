import { FindManyOptions } from 'typeorm';
import { ThemesModel } from '../entity/themes.entity';

export const DEFAULT_THEME_FIND_OPTIONS: FindManyOptions<ThemesModel> = {
  relations: ['store'],
}
