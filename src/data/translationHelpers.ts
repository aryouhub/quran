import { Language } from './translations';

export const quickSettingsTranslations: Record<Language, {
  from: string;
  quickSettings: string;
  selectReciter: string;
  selectTranslator: string;
  playbackSpeed: string;
  repeatMode: string;
  showTranslation: string;
  showTafsir: string;
  current: string;
  change: string;
}> = {
  fa: { from: 'از', quickSettings: 'تنظیمات سریع', selectReciter: 'انتخاب قاری', selectTranslator: 'انتخاب مترجم', playbackSpeed: 'سرعت پخش', repeatMode: 'حالت تکرار', showTranslation: 'نمایش ترجمه', showTafsir: 'نمایش تفسیر', current: 'فعلی', change: 'تغییر' },
  ar: { from: 'من', quickSettings: 'الإعدادات السريعة', selectReciter: 'اختر القارئ', selectTranslator: 'اختر المترجم', playbackSpeed: 'سرعة التشغيل', repeatMode: 'وضع التكرار', showTranslation: 'عرض الترجمة', showTafsir: 'عرض التفسير', current: 'الحالي', change: 'تغيير' },
  en: { from: 'from', quickSettings: 'Quick Settings', selectReciter: 'Select Reciter', selectTranslator: 'Select Translator', playbackSpeed: 'Playback Speed', repeatMode: 'Repeat Mode', showTranslation: 'Show Translation', showTafsir: 'Show Tafsir', current: 'Current', change: 'Change' },
  ur: { from: 'سے', quickSettings: 'فوری ترتیبات', selectReciter: 'قاری منتخب کریں', selectTranslator: 'مترجم منتخب کریں', playbackSpeed: 'پلے بیک کی رفتار', repeatMode: 'دہرائی کا موڈ', showTranslation: 'ترجمہ دکھائیں', showTafsir: 'تفسیر دکھائیں', current: 'موجودہ', change: 'تبدیل' },
  tr: { from: 'den', quickSettings: 'Hızlı Ayarlar', selectReciter: 'Okuyucu Seç', selectTranslator: 'Çevirmen Seç', playbackSpeed: 'Oynatma Hızı', repeatMode: 'Tekrar Modu', showTranslation: 'Çeviriyi Göster', showTafsir: 'Tefsiri Göster', current: 'Mevcut', change: 'Değiştir' },
  id: { from: 'dari', quickSettings: 'Pengaturan Cepat', selectReciter: 'Pilih Qari', selectTranslator: 'Pilih Penerjemah', playbackSpeed: 'Kecepatan Pemutaran', repeatMode: 'Mode Ulang', showTranslation: 'Tampilkan Terjemahan', showTafsir: 'Tampilkan Tafsir', current: 'Saat ini', change: 'Ubah' },
  fr: { from: 'de', quickSettings: 'Paramètres rapides', selectReciter: 'Sélectionner le récitateur', selectTranslator: 'Sélectionner le traducteur', playbackSpeed: 'Vitesse de lecture', repeatMode: 'Mode de répétition', showTranslation: 'Afficher la traduction', showTafsir: 'Afficher le tafsir', current: 'Actuel', change: 'Changer' },
  de: { from: 'von', quickSettings: 'Schnelleinstellungen', selectReciter: 'Rezitant auswählen', selectTranslator: 'Übersetzer auswählen', playbackSpeed: 'Wiedergabegeschwindigkeit', repeatMode: 'Wiederholungsmodus', showTranslation: 'Übersetzung anzeigen', showTafsir: 'Tafsir anzeigen', current: 'Aktuell', change: 'Ändern' },
  es: { from: 'de', quickSettings: 'Configuración rápida', selectReciter: 'Seleccionar recitador', selectTranslator: 'Seleccionar traductor', playbackSpeed: 'Velocidad de reproducción', repeatMode: 'Modo de repetición', showTranslation: 'Mostrar traducción', showTafsir: 'Mostrar tafsir', current: 'Actual', change: 'Cambiar' },
  ru: { from: 'из', quickSettings: 'Быстрые настройки', selectReciter: 'Выбрать чтеца', selectTranslator: 'Выбрать переводчика', playbackSpeed: 'Скорость воспроизведения', repeatMode: 'Режим повтора', showTranslation: 'Показать перевод', showTafsir: 'Показать тафсир', current: 'Текущий', change: 'Изменить' },
  zh: { from: '从', quickSettings: '快速设置', selectReciter: '选择诵读者', selectTranslator: '选择译者', playbackSpeed: '播放速度', repeatMode: '重复模式', showTranslation: '显示翻译', showTafsir: '显示经注', current: '当前', change: '更改' },
};

export const surahInfoTranslations: Record<Language, { juz: string; hizb: string; page: string }> = {
  fa: { juz: 'جزء', hizb: 'حزب', page: 'صفحه' },
  ar: { juz: 'جزء', hizb: 'حزب', page: 'صفحة' },
  en: { juz: 'Juz', hizb: 'Hizb', page: 'Page' },
  ur: { juz: 'پارہ', hizb: 'حزب', page: 'صفحہ' },
  tr: { juz: 'Cüz', hizb: 'Hizb', page: 'Sayfa' },
  id: { juz: 'Juz', hizb: 'Hizb', page: 'Halaman' },
  fr: { juz: 'Juz', hizb: 'Hizb', page: 'Page' },
  de: { juz: 'Juz', hizb: 'Hizb', page: 'Seite' },
  es: { juz: 'Juz', hizb: 'Hizb', page: 'Página' },
  ru: { juz: 'Джуз', hizb: 'Хизб', page: 'Страница' },
  zh: { juz: '卷', hizb: '段', page: '页' },
};

export const recitationStyles: Record<string, Record<Language, string>> = {
  murattal: { fa: 'ترتیل', ar: 'ترتيل', en: 'Murattal', ur: 'ترتیل', tr: 'Murattal', id: 'Murattal', fr: 'Murattal', de: 'Murattal', es: 'Murattal', ru: 'Муратталь', zh: '穆拉塔尔' },
  mujawwad: { fa: 'تحقیق', ar: 'تحقيق', en: 'Mujawwad', ur: 'تحقیق', tr: 'Mücenneb', id: 'Mujawwad', fr: 'Mujawwad', de: 'Mujawwad', es: 'Mujawwad', ru: 'Муджаввад', zh: '穆贾瓦德' },
  muallim: { fa: 'آموزشی', ar: 'تعليمي', en: 'Educational', ur: 'تعلیمی', tr: 'Eğitici', id: 'Pendidikan', fr: 'Éducatif', de: 'Lehrreich', es: 'Educativo', ru: 'Образовательный', zh: '教育性' },
};

export function getRecitationStyle(style: string, language: Language): string {
  return recitationStyles[style]?.[language] || style;
}
