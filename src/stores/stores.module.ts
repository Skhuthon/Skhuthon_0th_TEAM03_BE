import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresModel } from './entity/stores.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StoresModel])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
