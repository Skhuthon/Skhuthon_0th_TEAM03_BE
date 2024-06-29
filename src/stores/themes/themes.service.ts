import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThemesDto } from './dto/create-themes.dto';
import { UpdateThemesDto } from './dto/update-themes.dto';
import { ThemesModel } from './entity/themes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '../../common/common.service';
import { PaginateThemesDto } from './dto/paginate-themes.dto';
import { DEFAULT_THEME_FIND_OPTIONS } from './const/default-theme-find-options.const';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(ThemesModel)
    private readonly themesRepository: Repository<ThemesModel>,
    private readonly commonService: CommonService,
  ) {
  }

  async create(createThemeDto: CreateThemesDto): Promise<ThemesModel> {
    const theme = this.themesRepository.create(createThemeDto);
    return await this.themesRepository.save(theme);
  }

  async findAll(): Promise<ThemesModel[]> {
    return await this.themesRepository.find({
      ...DEFAULT_THEME_FIND_OPTIONS,
      take: 10,
      where: {
        id: 2,
      },
    });
  }

  async findOne(themeId: number): Promise<ThemesModel> {
    const theme = await this.themesRepository.findOne({
      where: {
        id: themeId,
      },
    });
    if (!theme) {
      throw new NotFoundException(`테마를 찾을 수 없습니다. ID: ${themeId}`);
    }
    return theme;
  }

  async update(
    themeId: number,
    updateThemeDto: UpdateThemesDto,
  ): Promise<ThemesModel> {
    const theme = await this.themesRepository.preload({
      id: themeId,
      ...updateThemeDto,
    });
    if (!theme) {
      throw new NotFoundException(`테마를 찾을 수 없습니다. ID: ${themeId}`);
    }
    return this.themesRepository.save(theme);
  }

  async remove(themeId: string): Promise<void> {
    const result = await this.themesRepository.delete(themeId);
    if (result.affected === 0) {
      throw new NotFoundException(`테마를 찾을 수 없습니다. ID: ${themeId}`);
    }
  }

  async pagePaginateThemes(dto: PaginateThemesDto) {
    const query = this.themesRepository
      .createQueryBuilder('theme')
      .leftJoin('theme.store', 'store')
      .leftJoin('store.region', 'region')
      .addSelect(['store.id', 'store.name', 'store.reservationSite']);

    if (dto.title) {
      query.andWhere('theme.title LIKE :title', { title: `%${dto.title}%` });
    }

    if (dto.region) {
      query.andWhere('region.name LIKE :region', { region: `%${dto.region}%` });
    }

    query
      .skip((dto.page - 1) * dto.take)
      .take(dto.take)
      .orderBy('theme.createdAt', dto.order__createdAt);

    const [themes, count] = await query.getManyAndCount();
    const totalPages = Math.ceil(count / dto.take);
    return {
      data: themes,
      total: count,
      totalPages,
    };
  }
}
