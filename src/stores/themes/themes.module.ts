import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesModel } from './entity/themes.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ThemesModel]), CommonModule],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
