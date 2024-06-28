import { BaseModel } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoresModel } from '../../entity/stores.entity';
import { DifficultyEnum } from '../../../common/enum/difficulty.enum';
import { GenreEnum } from '../../../common/enum/genre.enum';

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
    enum: Object.values(DifficultyEnum),
  })
  difficulty: DifficultyEnum;

  @Column({
    type: 'enum',
    enum: Object.values(GenreEnum),
  })
  genre: GenreEnum;
}
