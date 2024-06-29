import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesModel } from './entity/themes.entity';
import { CommonModule } from '../../common/common.module';
import { FuzzyModule } from 'src/fuzzy/fuzzy.module';

@Module({
  imports: [TypeOrmModule.forFeature([ThemesModel]), 
  CommonModule,
  FuzzyModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
