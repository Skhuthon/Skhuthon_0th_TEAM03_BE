import { Controller } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('매장 API')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}
}
