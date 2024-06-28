import { BaseModel } from '../../common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation-message';
import { StoresModel } from '../../stores/entity/stores.entity';

@Entity('region')
export class RegionModel extends BaseModel {
  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  name: string;

  @OneToMany(() => StoresModel, (store) => store.region)
  stores: StoresModel[];
}
