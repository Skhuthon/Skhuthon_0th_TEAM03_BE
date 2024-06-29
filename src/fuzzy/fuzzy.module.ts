import { Module } from '@nestjs/common';
import { FuzzyService } from './fuzzy.service';
import { FuzzyController } from './fuzzy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesModel } from 'src/stores/themes/entity/themes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemesModel])],
  providers: [FuzzyService],
  controllers: [FuzzyController],
})
export class FuzzyModule {}
