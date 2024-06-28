import { BaseModel } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoresModel } from '../../entity/stores.entity';
import { DifficultyEnum } from '../../../common/enum/difficulty.enum';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../../common/validation-message/string-validation-message';

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

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  genre: string;
}
