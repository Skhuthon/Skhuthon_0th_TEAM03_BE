import { Test, TestingModule } from '@nestjs/testing';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

describe('RegionController', () => {
  let controller: RegionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionController],
      providers: [RegionService],
    }).compile();

    controller = module.get<RegionController>(RegionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
