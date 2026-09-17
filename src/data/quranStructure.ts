export interface JuzInfo {
  number: number;
  name: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface HizbInfo {
  number: number;
  juz: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export const juzData: JuzInfo[] = [
  { number: 1, name: 'الم', startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { number: 2, name: 'سیقول', startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { number: 3, name: 'تلك الرسل', startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { number: 4, name: 'لن تنالوا', startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { number: 5, name: 'والمحصنات', startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { number: 6, name: 'لا يحب الله', startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { number: 7, name: 'وإذا سمعوا', startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { number: 8, name: 'ولو أننا', startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { number: 9, name: 'قال الملأ', startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { number: 10, name: 'واعلموا', startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { number: 11, name: 'یعتمدون', startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { number: 12, name: 'وما من دابة', startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { number: 13, name: 'وما أبرئ', startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { number: 14, name: 'ربما', startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { number: 15, name: 'سبحان الذي', startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { number: 16, name: 'قال ألم', startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { number: 17, name: 'اقترب', startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { number: 18, name: 'قد أفلح', startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { number: 19, name: 'وقال الذين', startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { number: 20, name: 'أمّن خلق', startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { number: 21, name: 'اتل ما أوحي', startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { number: 22, name: 'ومن يقنت', startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { number: 23, name: 'وما أنزلنا', startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { number: 24, name: 'فمن أظلم', startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { number: 25, name: 'إليه يرد', startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { number: 26, name: 'حم', startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { number: 27, name: 'قال فما خطبکم', startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { number: 28, name: 'قد سمع', startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { number: 29, name: 'تبارک الذي', startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { number: 30, name: 'عم یتساءلون', startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
];

export const hizbData: HizbInfo[] = juzData.flatMap((juz, idx) => [
  {
    number: idx * 2 + 1,
    juz: juz.number,
    startSurah: juz.startSurah,
    startAyah: juz.startAyah,
    endSurah: juz.endSurah,
    endAyah: Math.floor((juz.endSurah * 1000 + juz.endAyah - (juz.startSurah * 1000 + juz.startAyah)) / 2) % 1000 + juz.startAyah,
  },
  {
    number: idx * 2 + 2,
    juz: juz.number,
    startSurah: juz.endSurah,
    startAyah: Math.floor((juz.endSurah * 1000 + juz.endAyah - (juz.startSurah * 1000 + juz.startAyah)) / 2) % 1000 + juz.startAyah + 1,
    endSurah: juz.endSurah,
    endAyah: juz.endAyah,
  },
]);

export function getJuzForSurahAyah(surah: number, ayah: number): JuzInfo | undefined {
  return juzData.find(j => {
    const start = j.startSurah * 1000 + j.startAyah;
    const end = j.endSurah * 1000 + j.endAyah;
    const current = surah * 1000 + ayah;
    return current >= start && current <= end;
  });
}

export function getHizbForSurahAyah(surah: number, ayah: number): HizbInfo | undefined {
  return hizbData.find(h => {
    const start = h.startSurah * 1000 + h.startAyah;
    const end = h.endSurah * 1000 + h.endAyah;
    const current = surah * 1000 + ayah;
    return current >= start && current <= end;
  });
}
