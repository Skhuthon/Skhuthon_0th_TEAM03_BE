import { BaseModel } from '../../common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation-message';
import { StoresModel } from '../../stores/entity/stores.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('region')
export class RegionModel extends BaseModel {
  @ApiProperty({
    example: '홍대',
    description: '지역 이름',
  })
  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  name: string;

  @ApiProperty({
    description: '해당 지역에 속한 매장 목록',
    type: () => StoresModel,
  })
  @OneToMany(() => StoresModel, (store) => store.region)
  stores: StoresModel[];
}
