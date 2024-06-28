import { PickType } from '@nestjs/swagger';
import { RegionModel } from '../entities/region.entity';

export class CreateRegionDto extends PickType(RegionModel, ['name']) {}
