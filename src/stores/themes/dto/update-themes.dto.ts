import { PartialType } from '@nestjs/swagger';
import { CreateThemesDto } from './create-themes.dto';

export class UpdateThemesDto extends PartialType(CreateThemesDto) {}
