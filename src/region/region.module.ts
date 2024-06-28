import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { RegionModel } from './entities/region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RegionModel])],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
