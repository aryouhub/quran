import { Language } from './translations';

export interface Reciter {
  id: string;
  name: Record<Language, string>;
  arabicName: string;
  country: Record<Language, string>;
  style: 'murattal' | 'mujawwad' | 'muallim';
  source: 'alquran' | 'quranicaudio' | 'qurankareem';
  quranAudioId?: number;
  audioPath?: string;
  available: boolean;
}

export interface Translator {
  id: string;
  name: string;
  language: Record<Language, string>;
  country: Record<Language, string>;
  available: boolean;
}

export interface ArabicFont {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  hasHarakat: boolean;
}

export interface PersianFont {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
}

const ml = (fa: string, ar: string, en: string): Record<Language, string> => ({
  fa, ar, en, ur: fa, tr: en, id: en, fr: en, de: en, es: en, ru: en, zh: en
});

export const reciters: Reciter[] = [
  { id: 'ar.alafasy', name: ml('مشاری العفاسی', 'مشاري العفاسي', 'Mishary Alafasy'), arabicName: 'مشاری راشد العفاسی', country: ml('کویت', 'الكويت', 'Kuwait'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.abdurrahmaansudais', name: ml('عبدالرحمن السدیس', 'عبدالرحمن السديس', 'Abdulrahman Al-Sudais'), arabicName: 'عبدالرحمن السدیس', country: ml('عربستان', 'السعودية', 'Saudi Arabia'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.hudhaify', name: ml('علی الحذیفی', 'علي الحذيفي', 'Ali Al-Hudhaify'), arabicName: 'علی الحذیفی', country: ml('عربستان', 'السعودية', 'Saudi Arabia'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.abdulsamad', name: ml('عبدالباسط عبدالصمد', 'عبد الباسط عبد الصمد', 'Abdulbasit Abdulsamad'), arabicName: 'عبدالباسط عبدالصمد', country: ml('مصر', 'مصر', 'Egypt'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.mahermuaiqly', name: ml('ماهر المعیقلی', 'ماهر المعيقلي', 'Maher Al-Muaiqly'), arabicName: 'ماهر المعیقلی', country: ml('عربستان', 'السعودية', 'Saudi Arabia'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.saoodshuraym', name: ml('سعود الشوریم', 'سعود الشريم', 'Saud Al-Shuraim'), arabicName: 'سعود الشوریم', country: ml('عربستان', 'السعودية', 'Saudi Arabia'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.husary', name: ml('محمود خلیل الحصری', 'محمود خليل الحصري', 'Mahmoud Al-Husary'), arabicName: 'محمود خلیل الحصری', country: ml('مصر', 'مصر', 'Egypt'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.husarymujawwad', name: ml('محمود خلیل الحصری (مجوّد)', 'محمود خليل الحصري (مجود)', 'Mahmoud Al-Husary (Mujawwad)'), arabicName: 'محمود خلیل الحصری', country: ml('مصر', 'مصر', 'Egypt'), style: 'mujawwad', source: 'alquran', available: true },
  { id: 'ar.muhammadjibreel', name: ml('محمد جبریل', 'محمد جبريل', 'Mohammad Jibreel'), arabicName: 'محمد جبریل', country: ml('مصر', 'مصر', 'Egypt'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.muhammadayyoub', name: ml('محمد ایوب', 'محمد أيوب', 'Mohammad Ayyoub'), arabicName: 'محمد ایوب', country: ml('عربستان', 'السعودية', 'Saudi Arabia'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.ahmedajamy', name: ml('احمد العجمی', 'أحمد بن علي العجمي', 'Ahmad Al-Ajamy'), arabicName: 'احمد العجمی', country: ml('امارات', 'الإمارات', 'UAE'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.abdullahbasfar', name: ml('عبدالله بصفر', 'عبدالله بصفر', 'Abdullah Basfar'), arabicName: 'عبدالله بصفر', country: ml('عربستان', 'السعودية', 'Saudi Arabia'), style: 'murattal', source: 'alquran', available: true },
  { id: 'ar.parhizgar', name: ml('شهریار پرهیزگار', 'شهريار برهيزكار', 'Shahriar Parhizgar'), arabicName: 'شهریار پرهیزگار', country: ml('ایران', 'إيران', 'Iran'), style: 'murattal', source: 'alquran', available: true },
];

export const translators: Translator[] = [
  { id: 'fa.makarem', name: 'ناصر مکارم شیرازی', language: ml('فارسی', 'الفارسية', 'Persian'), country: ml('ایران', 'إيران', 'Iran'), available: true },
  { id: 'fa.fooladvand', name: 'محمد مهدی فولادوند', language: ml('فارسی', 'الفارسية', 'Persian'), country: ml('ایران', 'إيران', 'Iran'), available: true },
  { id: 'fa.ayati', name: 'عبدالمحمد آیتی', language: ml('فارسی', 'الفارسية', 'Persian'), country: ml('ایران', 'إيران', 'Iran'), available: true },
  { id: 'en.sahih', name: 'Saheeh International', language: ml('انگلیسی', 'الإنجليزية', 'English'), country: ml('آمریکا', 'أمريكا', 'USA'), available: true },
  { id: 'en.yusufali', name: 'Abdullah Yusuf Ali', language: ml('انگلیسی', 'الإنجليزية', 'English'), country: ml('هند', 'الهند', 'India'), available: true },
  { id: 'en.pickthall', name: 'Marmaduke Pickthall', language: ml('انگلیسی', 'الإنجليزية', 'English'), country: ml('انگلستان', 'إنجلترا', 'England'), available: true },
  { id: 'ar.jalalayn', name: 'جلال‌الدین محلی و سیوطی', language: ml('عربی', 'العربية', 'Arabic'), country: ml('مصر', 'مصر', 'Egypt'), available: true },
  { id: 'ar.muyassar', name: 'مجمع ملک فهد', language: ml('عربی', 'العربية', 'Arabic'), country: ml('عربستان', 'السعودية', 'Saudi Arabia'), available: true },
];

export const arabicFonts: ArabicFont[] = [
  { id: 'amiri', name: ml('امیری', 'أميري', 'Amiri'), description: ml('فونت عربی با اعراب کامل', 'خط عربي مع التشكيل الكامل', 'Arabic font with full diacritics'), hasHarakat: true },
  { id: 'scheherazade', name: ml('شهرزاد', 'شهرزاد', 'Scheherazade'), description: ml('فونت عربی خوانا با اعراب', 'خط عربي واضح مع التشكيل', 'Readable Arabic font with diacritics'), hasHarakat: true },
  { id: 'lateef', name: ml('لطیف', 'لطيف', 'Lateef'), description: ml('فونت عربی ساده', 'خط عربي بسيط', 'Simple Arabic font'), hasHarakat: false },
];

export const persianFonts: PersianFont[] = [
  { id: 'vazirmatn', name: ml('وزیرمتن', 'وزير متن', 'Vazirmatn'), description: ml('فونت فارسی مدرن و خوانا', 'خط فارسي حديث وواضح', 'Modern and readable Persian font') },
  { id: 'sahel', name: ml('ساحل', 'ساحل', 'Sahel'), description: ml('فونت فارسی زیبا', 'خط فارسي جميل', 'Beautiful Persian font') },
  { id: 'shabnam', name: ml('شبنم', 'شبنم', 'Shabnam'), description: ml('فونت فارسی ساده', 'خط فارسي بسيط', 'Simple Persian font') },
  { id: 'samim', name: ml('صمیم', 'صميم', 'Samim'), description: ml('فونت فارسی رسمی', 'خط فارسي رسمي', 'Formal Persian font') },
];
