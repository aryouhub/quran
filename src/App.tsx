import { useState, createContext, useContext, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext<any>(null);
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// Surahs Data
const surahs = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: `سوره ${i + 1}`,
  persianName: `سوره ${i + 1}`,
  englishName: `Surah ${i + 1}`,
  ayahs: Math.floor(Math.random() * 20) + 3,
  type: i < 86 ? 'Meccan' : 'Medinan'
}));

// Translations
const translations = {
  fa: { title: 'قرانی‌ها', surahs: 'سوره‌ها', settings: 'تنظیمات', read: 'مطالعه', selectSurah: 'سوره‌ای انتخاب کنید' },
  ar: { title: 'القرآنیون', surahs: 'السور', settings: 'الإعدادات', read: 'قراءة', selectSurah: 'اختر سورة' },
  en: { title: 'Quranis', surahs: 'Surahs', settings: 'Settings', read: 'Read', selectSurah: 'Select a Surah' }
};

export default function App() {
  const [lang, setLang] = useState<'fa' | 'ar' | 'en'>('fa');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const t = translations[lang];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">{t.title}</h1>
          <div className="flex items-center gap-2">
            <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1">
              <option value="fa">فارسی</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
            <button onClick={() => setImmersiveMode(!immersiveMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title={t.read}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className="text-emerald-500">
                <path d="M0 0h512v512H0z" fill="none" />
                <path fill="currentColor" fillRule="evenodd" d="M331.52 117.547c0 41.386-33.707 74.88-74.88 74.88c-41.387 0-74.88-33.494-74.88-74.88c0-41.387 33.493-74.88 74.88-74.88s74.88 33.493 74.88 74.88m-96.853 125.748L64 157.867v215.04l170.667 85.428zm42.666 215.681l171.947-86.069v-215.04l-171.947 86.069z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </header>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t.surahs}</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {surahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => { setSelectedSurah(surah.number); setSidebarOpen(false); }}
                    className={`p-3 rounded-lg text-right ${selectedSurah === surah.number ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    <div className="font-bold text-sm">{surah.number}</div>
                    <div className="text-xs mt-1">{lang === 'en' ? surah.englishName : surah.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`pt-14 ${immersiveMode ? 'pb-0' : 'pb-20'}`}>
          {selectedSurah ? (
            <div className="p-4 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{surahs[selectedSurah - 1]?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t.surahs}: {selectedSurah}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setSidebarOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 512 512" className="mx-auto mb-6 text-emerald-400">
                  <path d="M0 0h512v512H0z" fill="none" />
                  <path fill="currentColor" fillRule="evenodd" d="M331.52 117.547c0 41.386-33.707 74.88-74.88 74.88c-41.387 0-74.88-33.494-74.88-74.88c0-41.387 33.493-74.88 74.88-74.88s74.88 33.493 74.88 74.88m-96.853 125.748L64 157.867v215.04l170.667 85.428zm42.666 215.681l171.947-86.069v-215.04l-171.947 86.069z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold mb-2">{t.selectSurah}</h3>
              </div>
            </div>
          )}
        </main>

        {/* Player */}
        {!immersiveMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-center gap-4">
              <button className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Immersive Mode Controls */}
        {immersiveMode && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full px-3 py-2 shadow-lg">
            <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => setImmersiveMode(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
