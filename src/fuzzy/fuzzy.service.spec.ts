import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuzzyService } from './fuzzy.service';
import { ThemesModel } from 'src/stores/themes/entity/themes.entity';
import { StoresModel } from 'src/stores/entity/stores.entity';
import { RegionModel } from 'src/region/entities/region.entity';
import { DifficultyEnum } from 'src/common/enum/difficulty.enum';

const mockThemeRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }),
});

describe('FuzzyService', () => {
  let service: FuzzyService;
  let repository: Repository<ThemesModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuzzyService,
        {
          provide: getRepositoryToken(ThemesModel),
          useFactory: mockThemeRepository,
        },
      ],
    }).compile();

    service = module.get<FuzzyService>(FuzzyService);
    repository = module.get<Repository<ThemesModel>>(getRepositoryToken(ThemesModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchThemesByTitle', () => {
    it('should return an array of themes', async () => {
      const result: ThemesModel[] = [{ 
        id: 1,
        title: 'example',
        difficulty: DifficultyEnum.EASY,
        genre: '모험',
        store: null, // store는 나중에 할당합니다.
        updatedAt: new Date(),
        createdAt: new Date(),
      }];

      const stores: StoresModel[] = [{
        id: 1,
        name: '매장명 솔버 2호점',
        reservationSite: 'abcdefg.com',
        themes: result,
        region: null, // region은 나중에 할당합니다.
        createdAt: new Date(),
        updatedAt: new Date(),
      }];

      const region: RegionModel = {
        id: 1,
        name: '서울',
        stores: stores,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // stores와 result 객체에 각각 region과 store를 할당합니다.
      stores[0].region = region;
      result[0].store = stores[0];

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValue(result);

      expect(await service.searchThemesByTitle('ex')).toEqual(result);
    });

    it('should call createQueryBuilder and apply the correct pattern', async () => {
      const title = 'test';
      const pattern = service.createFuzzyMatcher(title);
      const whereSpy = jest.spyOn(repository.createQueryBuilder(), 'where');

      await service.searchThemesByTitle(title);

      expect(whereSpy).toHaveBeenCalledWith('theme.title ~* :pattern', { pattern });
    });
  });
});
