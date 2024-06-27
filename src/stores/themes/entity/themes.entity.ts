import { BaseModel } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoresModel } from '../../entity/stores.entity';
import { DifficultyEnum } from '../../../util/difficulty.enum';
import { GenreEnum } from '../../../util/genre.enum';

@Entity('themes')
export class ThemesModel extends BaseModel {
  /**
   * 1. 테마명: string
   * 2. 매장명: StoresModel
   * 3. 난이도: enum
   * 4. 장르: enum
   */

  @Column()
  title: string;

  @ManyToOne(() => StoresModel, (store) => store.themes)
  store: StoresModel;

  @Column({
    type: 'enum',
    enum: DifficultyEnum,
  })
  difficulty: DifficultyEnum;

  @Column({
    type: 'enum',
    enum: GenreEnum,
  })
  genre: GenreEnum;
}
