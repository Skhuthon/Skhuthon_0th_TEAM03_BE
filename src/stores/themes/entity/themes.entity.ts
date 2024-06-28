import { BaseModel } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoresModel } from '../../entity/stores.entity';
import { DifficultyEnum } from '../../../common/enum/difficulty.enum';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../../common/validation-message/string-validation-message';
import { ApiProperty } from '@nestjs/swagger';

@Entity('themes')
export class ThemesModel extends BaseModel {
  /**
   * 1. 테마명: string
   * 2. 매장명: StoresModel
   * 3. 난이도: enum
   * 4. 장르: enum
   */

  @Column()
  @ApiProperty({
    description: '테마명',
    example: '공포의 집',
  })
  title: string;

  @ManyToOne(() => StoresModel, (store) => store.themes)
  @ApiProperty({
    description: '매장명',
    type: () => StoresModel,
  })
  store: StoresModel;

  @Column({
    type: 'enum',
    enum: Object.values(DifficultyEnum),
  })
  @ApiProperty({
    description: '난이도',
    enum: DifficultyEnum,
    example: DifficultyEnum.NORMAL,
  })
  difficulty: DifficultyEnum;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @ApiProperty({
    description: '장르',
    example: '공포',
  })
  genre: string;
}
