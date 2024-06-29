import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { ThemesModel } from 'src/stores/themes/entity/themes.entity';

@Injectable()
export class FuzzyService {
    constructor(
        @InjectRepository(ThemesModel)
        private readonly themeRepository: Repository<ThemesModel>,
    ) {}

  // 한글 유니코드 범위를 처리하여 패턴을 생성하는 함수
  private chageUnicode(ch: string): string {
    const offset = 44032; // '가'의 코드
    const choArr = {
      ㄱ: '가'.charCodeAt(0),
      ㄲ: '까'.charCodeAt(0),
      ㄴ: '나'.charCodeAt(0),
      ㄷ: '다'.charCodeAt(0),
      ㄸ: '따'.charCodeAt(0),
      ㄹ: '라'.charCodeAt(0),
      ㅁ: '마'.charCodeAt(0),
      ㅂ: '바'.charCodeAt(0),
      ㅃ: '빠'.charCodeAt(0),
      ㅅ: '사'.charCodeAt(0),
    };

    // 초성 + 중성 + (종성) 완전한 문자일 경우
    if (/[가-힣]/.test(ch)) {
      const chCode = ch.charCodeAt(0) - offset;
      // 종성이 있으면 문자 그대로를 찾는다.
      if (chCode % 28 > 0) {
        return ch;
      }
      const begin = Math.floor(chCode / 28) * 28 + offset;
      const end = begin + 27;
      return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
    }

    // 초성만 있을 경우
    if (/[ㄱ-ㅎ]/.test(ch)) {
      const begin = choArr[ch] || (ch.charCodeAt(0) - 12613) * 588 + choArr["ㅅ"];
      const end = begin + 587;
      return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
    }

    // 그 외엔 그대로 내보냄
    return _.escapeRegExp(ch); // 정규식에서 의미있는 와일드카드들을 문자열로 바꿔주는 함수
  }

  // 입력 문자열을 받아서 퍼지 매칭 패턴을 생성하는 함수
  createFuzzyMatcher(input: string): string {
    if (input === undefined) return ".";
    const pattern = input.split("").map(this.chageUnicode).join(".*?");
    return pattern;
  }

  // 주어진 이름 패턴에 따라 유사한 이름을 가진 사용자들을 검색하는 함수
  async searchThemesByTitle(title: string): Promise<ThemesModel[]> {
    const pattern = this.createFuzzyMatcher(title);
    const result = await this.themeRepository
      .createQueryBuilder('theme')
      .where('theme.title ~* :pattern', { pattern })
      .getMany();
    return result;
  }
}
