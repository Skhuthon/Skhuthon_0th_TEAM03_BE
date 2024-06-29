import { Controller, Get, Query } from '@nestjs/common';
import { FuzzyService } from './fuzzy.service';
import { ThemesModel } from 'src/stores/themes/entity/themes.entity';

@Controller('fuzzy')
export class FuzzyController {
  constructor(private readonly fuzzyService: FuzzyService) {}

  // GET /fuzzy/search 엔드포인트를 구현하여 퍼지 매칭 패턴을 반환합니다.
  @Get('search')
  createFuzzyMatcher(@Query('title') title: string): Promise<ThemesModel[]> {
    return this.fuzzyService.searchThemesByTitle(title);
  }
}
