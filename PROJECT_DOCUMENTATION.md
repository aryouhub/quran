# 📖 پروژه قرآنی‌ها - مستندات کامل

## 🎯 معرفی پروژه
یک اپلیکیشن وب مدرن برای مطالعه و شنیدن قرآن کریم با پشتیبانی از 11 زبان، پخش صوت، ترجمه، تفسیر و ناوبری هوشمند.

## ✨ ویژگی‌های اصلی

### 1. پخش صوت قرآن
- پخش آیه به آیه از API `alquran.cloud`
- پشتیبانی از 3 منبع صوتی:
  - `alquran.cloud` (16 قاری فعال)
  - `quranicaudio.com` (87 قاری - با برچسب "به زودی")
  - `audio.qurankareem.co` (3 قاری ایرانی)
- کنترل‌های پخش: پخش/توقف، قبلی/بعدی، تکرار (none/one/all)، سرعت (0.5x تا 2x)
- نوار پیشرفت با زمان فعلی و کل
- هایلایت خودکار آیه در حال تلاوت
- اسکرول خودکار به آیه فعال

### 2. 114 سوره قرآن
- نام فارسی صحیح (فاتحه، بقره، آل‌عمران، ...)
- نام عربی، انگلیسی و ترجمه به 11 زبان
- اطلاعات: تعداد آیات، مکی/مدنی
- جستجو به فارسی، عربی و انگلیسی
- فیلتر: همه، مکی، مدنی

### 3. ترجمه و تفسیر
- 45+ مترجم از 25+ زبان
- ترجمه فارسی: مکارم، فولادوند، آیتی، قمشه‌ای، انصاریان
- ترجمه انگلیسی: Saheeh, Yusuf Ali, Pickthall, ...
- تفسیرهای عربی: المیسر، الجلالین، القرطبی، البغوی، الوسیط
- قابلیت نمایش/مخفی کردن ترجمه و تفسیر

### 4. ناوبری هوشمند
- انتخاب آیه (Grid از تمام آیات سوره)
- انتخاب حزب (فقط حزب‌های سوره فعلی)
- انتخاب جزء (فقط جزء‌های سوره فعلی)
- نمایش جزء، حزب، صفحه فعلی
- 30 جزء، 60 حزب، 604 صفحه

### 5. تنظیمات کامل
- حالت نمایش: روشن/تاریک/سیستمی
- زبان: 11 زبان
- اندازه فونت: 12-24 پیکسل
- تنظیمات صدا
- فونت عربی و فارسی
- قاری و مترجم
- تفسیر

### 6. حالت مطالعه غوطه‌ور
- مخفی کردن هدر، پلیر، سایدبار
- فونت بزرگ‌تر و فاصله بیشتر
- کنترل‌های مینیمال

### 7. طراحی ریسپانسیو
- موبایل: BottomNavigation + Grid 2 ستونه
- تبلت: Sidebar ثابت 320px + Grid 2 ستونه
- دسکتاپ: Sidebar ثابت 384-448px + Grid 3 ستونه

## 📁 ساختار فایل‌ها

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Player.tsx
│   ├── AyahDisplay.tsx
│   ├── SettingsPage.tsx
│   ├── QuickSettingsPanel.tsx
│   ├── NavigationPanel.tsx
│   ├── BottomNavigation.tsx
│   └── SurahGrid.tsx
├── context/
│   ├── ThemeContext.tsx
│   ├── SettingsContext.tsx
│   └── LanguageContext.tsx
├── hooks/
│   └── useAudioPlayer.ts
├── data/
│   ├── surahs.ts
│   ├── translations.ts
│   ├── fontsAndReciters.ts
│   ├── tafsirs.ts
│   ├── quranStructure.ts
│   ├── recitationStyles.ts
│   ├── quickSettingsTranslations.ts
│   └── surahInfoTranslations.ts
└── utils/
    ├── persianNumber.ts
    └── transliteration.ts
```

## 🔌 API های استفاده شده
- `api.alquran.cloud` - متن، ترجمه، صوت
- `quranicaudio.com` - قاریان اضافی
- `audio.qurankareem.co` - قاریان ایرانی

## 🎨 ویژگی‌های طراحی
- فونت وزیرمتن برای UI
- فونت Amiri برای متون عربی
- اعداد فارسی در همه جا
- SVG آیکون‌ها
- رنگ‌بندی Emerald/Teal
- انیمیشن‌های CSS
- Safe area برای notch
- Touch optimization

## 🚀 شروع کار

### نصب وابستگی‌ها
```bash
npm install
```

### اجرای پروژه
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📝 نسخه
1.0.0

## 👨‍💻 توسعه‌دهنده
پروژه قرآنی‌ها - 2024
