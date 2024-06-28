import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { ThemesModel } from '../themes/entity/themes.entity';
import { RegionModel } from '../../region/entities/region.entity';

@Entity('stores')
export class StoresModel extends BaseModel {
  /**
   * 1. 상점명: string
   * 2. 테마들: ThemesModel[]
   * 3. 지역: RegionModel
   * 4. 예약 사이트: string
   */
  @Column()
  name: string;

  @OneToMany(() => ThemesModel, (theme) => theme.store)
  themes: ThemesModel[];

  @Column({
    nullable: true,
  })
  reservationSite: string;

  @ManyToOne(() => RegionModel, (region) => region.stores)
  region: RegionModel;
}
