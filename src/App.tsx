import { useState, useEffect } from 'react';

const surahs = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: `Surah ${i + 1}`,
  persianName: `Chapter ${i + 1}`,
  englishName: `Surah ${i + 1}`,
  ayahs: Math.floor(Math.random() * 20) + 3,
  type: i < 86 ? 'Meccan' : 'Medinan'
}));

const translations = {
  fa: { title: 'Quran App', surahs: 'Surahs', settings: 'Settings', read: 'Read', selectSurah: 'Select a Surah', navigation: 'Navigation', ayah: 'Ayah', from: 'from' },
  ar: { title: 'Quran App', surahs: 'Surahs', settings: 'Settings', read: 'Read', selectSurah: 'Select a Surah', navigation: 'Navigation', ayah: 'Ayah', from: 'from' },
  en: { title: 'Quran App', surahs: 'Surahs', settings: 'Settings', read: 'Read', selectSurah: 'Select a Surah', navigation: 'Navigation', ayah: 'Ayah', from: 'from' }
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'fa' | 'ar' | 'en'>('fa');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <header className={`fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center justify-between px-4 transition-all ${immersiveMode ? 'hidden md:flex' : ''}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            )}
          </button>
          <button onClick={() => setImmersiveMode(!immersiveMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title={t.read}>
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <aside className="fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t.surahs}</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {surahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => { setSelectedSurah(surah.number); setSidebarOpen(false); setCurrentAyah(1); }}
                  className={`p-3 rounded-lg text-right transition-all ${selectedSurah === surah.number ? 'bg-emerald-500 text-white scale-105' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  <div className="font-bold text-sm">{surah.number}</div>
                  <div className="text-xs mt-1">{lang === 'en' ? surah.englishName : surah.name}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      <main className={`pt-14 transition-all ${immersiveMode ? 'pb-0' : 'pb-20'}`}>
        {selectedSurah ? (
          <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{surahs[selectedSurah - 1]?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.ayah} {currentAyah} {t.from} {surahs[selectedSurah - 1]?.ayahs}
              </p>
            </div>
            <div className="space-y-4">
              {Array.from({ length: surahs[selectedSurah - 1]?.ayahs || 0 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentAyah(i + 1)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${currentAyah === i + 1 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    {currentAyah === i + 1 && (
                      <span className="text-emerald-500 text-sm font-medium">{t.read}</span>
                    )}
                  </div>
                  <p className="text-lg text-right leading-loose">
                    In the name of God, the Most Gracious, the Most Merciful
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setSidebarOpen(true)}>
              <svg className="w-24 h-24 mx-auto mb-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-bold mb-2">{t.selectSurah}</h3>
            </div>
          </div>
        )}
      </main>

      {!immersiveMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {immersiveMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full px-3 py-2 shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title={t.surahs}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title={t.navigation}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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
  );
}
