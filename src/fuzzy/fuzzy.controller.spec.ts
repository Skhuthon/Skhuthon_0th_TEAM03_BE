import { Test, TestingModule } from '@nestjs/testing';
import { FuzzyController } from './fuzzy.controller';

describe('FuzzyController', () => {
  let controller: FuzzyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuzzyController],
    }).compile();

    controller = module.get<FuzzyController>(FuzzyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
