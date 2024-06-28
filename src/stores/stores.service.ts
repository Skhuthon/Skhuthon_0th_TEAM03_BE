import { Injectable } from '@nestjs/common';
import { StoresModel } from './entity/stores.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoresModel)
    private readonly storesRepository: Repository<StoresModel>,
  ) {}
}
