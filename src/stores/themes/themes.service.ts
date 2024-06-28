import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThemesDto } from './dto/create-themes.dto';
import { UpdateThemesDto } from './dto/update-themes.dto';
import { ThemesModel } from './entity/themes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(ThemesModel)
    private readonly themesRepository: Repository<ThemesModel>,
  ) {}

  async create(createThemeDto: CreateThemesDto): Promise<ThemesModel> {
    const theme = this.themesRepository.create(createThemeDto);
    return await this.themesRepository.save(theme);
  }

  async findAll(): Promise<ThemesModel[]> {
    return await this.themesRepository.find();
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
}
