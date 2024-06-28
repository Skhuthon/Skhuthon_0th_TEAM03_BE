import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesModel } from './entity/themes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemesModel])],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
