export function korToEng(str: string): string {
    const kor = "ㅂㅃㅈㅉㄷㄸㄱㄲㅅㅆㅛㅛㅕㅕㅑㅑㅐㅐㅔㅔㅁㅁㄴㄴㅇㅇㄹㄹㅎㅎㅗㅗㅓㅓㅏㅏㅣㅣㅋㅋㅌㅌㅊㅊㅍㅍㅠㅠㅜㅜㅡㅡ";
    const eng = "qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM";
    const map = new Map();
    kor.split('').forEach((key, idx) => map.set(key, eng[idx]));
    return str.split('').map(char => map.get(char) || char).join('');
  }
  
  export function engToKor(str: string): string {
    const kor = "ㅂㅃㅈㅉㄷㄸㄱㄲㅅㅆㅛㅛㅕㅕㅑㅑㅐㅐㅔㅔㅁㅁㄴㄴㅇㅇㄹㄹㅎㅎㅗㅗㅓㅓㅏㅏㅣㅣㅋㅋㅌㅌㅊㅊㅍㅍㅠㅠㅜㅜㅡㅡ";
    const eng = "qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM";
    const map = new Map();
    eng.split('').forEach((key, idx) => map.set(key, kor[idx]));
    return str.split('').map(char => map.get(char) || char).join('');
  }

  export function isKorean(text: string): boolean {
    const koreanRegex = /[가-힣]/;
    return koreanRegex.test(text);
  }