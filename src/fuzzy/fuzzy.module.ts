import { Module } from '@nestjs/common';
import { FuzzyService } from './fuzzy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesModel } from 'src/stores/themes/entity/themes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemesModel])],
  exports: [FuzzyService],
  providers: [FuzzyService],
})
export class FuzzyModule {}
