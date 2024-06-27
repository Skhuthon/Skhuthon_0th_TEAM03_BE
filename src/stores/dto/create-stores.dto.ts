import { PickType } from '@nestjs/swagger';
import { StoresModel } from '../entity/stores.entity';

export class CreateStoresDto extends PickType(StoresModel, [
  'name',
  'region',
  'reservationSite',
  'themes',
]) {
  email: string;
}
