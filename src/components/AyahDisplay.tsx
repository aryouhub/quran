import { useState, useEffect, useRef } from 'react';
import { toPersianNumber } from '../utils/persianNumber';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface AyahDisplayProps {
  surahNumber: number;
  currentAyah: number;
  onAyahClick: (ayahNumber: number) => void;
  isLoading: boolean;
  onOpenSidebar?: () => void;
}

export function AyahDisplay({ surahNumber, currentAyah, onAyahClick, isLoading, onOpenSidebar }: AyahDisplayProps) {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!surahNumber) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${settings.translator}`).then(r => r.json()),
    ])
      .then(([arabicData, translationData]) => {
        if (arabicData.code === 200 && translationData.code === 200) {
          const arabicAyahs = arabicData.data.ayahs;
          const translationAyahs = translationData.data.ayahs;

          const combined: Ayah[] = arabicAyahs.map((ayah: any, index: number) => ({
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text: ayah.text,
            translation: translationAyahs[index]?.text || '',
          }));

          setAyahs(combined);
        } else {
          setError('خطا در بارگذاری آیات');
        }
      })
      .catch(() => {
        setError('خطا در اتصال به سرور');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [surahNumber, settings.translator]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentAyah]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-theme-muted text-sm sm:text-base">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[400px]">
        <div className="text-center p-4 sm:p-6 bg-red-900/20 rounded-xl border border-red-800/50 max-w-sm">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p className="text-red-400 text-base sm:text-lg mb-2">{error}</p>
          <p className="text-theme-muted text-xs sm:text-sm">لطفاً دوباره تلاش کنید</p>
        </div>
      </div>
    );
  }

  if (ayahs.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-12rem)]">
        <div 
          className="text-center max-w-md mx-auto cursor-pointer hover:scale-105 transition-transform"
          onClick={onOpenSidebar}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="120" 
            height="120" 
            viewBox="0 0 48 48"
            className="mx-auto mb-6 text-emerald-400/60 hover:text-emerald-400 transition-colors"
          >
            <path d="M0 0h48v48H0z" fill="none" />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M23.224 13.542c2.496-2.86 4.767-5.13 3.701-6.28S8.613 12.515 9.586 14.187c.58.996 15.989 12.179 17.509 13.078c1.785 1.056 4.653-.18 4.4-2.144L29.168 7.11s1.178 1.582 1.542 2.675m4.374 16.722c-.252-1.963-2.327-18.012-2.327-18.012s1.178 1.582 1.542 2.676" />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M28.383 33.87c0-6.218-2.09-20.011-2.09-20.011s1.178 1.581 1.543 2.675m-5.766-1.987c-.364-1.094-1.541-2.676-1.541-2.676s.593 7.208 4.041 8.638c-9.246-4.479-13.647 10.178-17.642 5.888c-2.851-3.06 2.27-7.36 2.27-7.36" />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M37.916 14.03c-.365-1.093-1.542-2.675-1.542-2.675S38.4 29.25 38.832 33.87c.205 2.201-3.874 3.21-5.388-.49s-.126-4.753.799-4.753s2.44 3.084 0 4.514s-6.505 2.468-7.738 3.897s-3.393 4.71-4.823 4.71s-4.233-1.541-1.037-7.878m20.804-2.72c-.253-3.28-1.963-16.57-1.963-16.57s1.178 1.581 1.542 2.675M13.993 8.944c1.724-1.073 5.278-1.745 7.129-3.196M8.981 27.193C6.682 29.72 7.327 34.85 10.02 34.01c1.005-.314 2.215-2.404 4.233-3.308c3.387-1.516 7.719-2.29 7.458-4.71c-.336-3.126-3.336-4.945-3.336-4.945" />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M25.818 29.019c-1.437-.635-1.907-1.367-1.907-1.367c1.164 2.6 2.061 4.184 2.09 5.432s-6.407 5.236-9.17 5.236c-3.216 0-5.57-2.312-4.656-6.15m-2.04-17.435c-2.114.98-3.425 5.617-1.813 5.149" />
            <circle cx="24" cy="24" r="21.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-theme-primary text-xl sm:text-2xl font-bold mb-3">{t.selectSurah}</h3>
          <p className="text-theme-muted text-sm sm:text-base leading-relaxed">
            {t.selectSurahDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-32" dir="rtl">
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center mb-6 sm:mb-8 py-4 sm:py-6">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-emerald-400 font-arabic leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
        {ayahs.map((ayah) => {
          const isActive = currentAyah === ayah.numberInSurah;
          return (
            <div
              key={ayah.number}
              ref={isActive ? activeRef : null}
              onClick={() => onAyahClick(ayah.numberInSurah)}
              className={`
                rounded-lg sm:rounded-xl p-3 sm:p-5 cursor-pointer transition-all duration-500 border
                ${isActive
                  ? isDark
                    ? 'bg-emerald-900/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-theme-secondary/80 border-theme hover:bg-theme-hover hover:border-theme'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className={`
                  inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-[10px] sm:text-sm font-bold
                  ${isActive 
                    ? isDark 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-emerald-600 text-white'
                    : 'bg-theme-tertiary text-theme-muted'}
                `}>
                  {toPersianNumber(ayah.numberInSurah)}
                </span>
                {isActive && (
                  <span className={`flex items-center gap-1 text-[10px] sm:text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                    {t.playing}
                  </span>
                )}
              </div>

              <p className={`
                text-right leading-[2.2] sm:leading-[2.5] mb-2 sm:mb-4 font-arabic
                ${isActive ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl text-theme-primary' : 'text-base sm:text-lg md:text-xl text-theme-secondary'}
                transition-all duration-500
              `}>
                {ayah.text}
              </p>

              {settings.showTranslation && ayah.translation && (
                <div className={`
                  border-t pt-2 sm:pt-3 transition-all duration-500
                  ${isActive ? isDark ? 'border-emerald-700/50' : 'border-emerald-300' : 'border-theme'}
                `}>
                  <p className={`
                    text-right leading-relaxed text-[11px] sm:text-xs md:text-sm
                    ${isActive ? isDark ? 'text-emerald-200' : 'text-emerald-800' : 'text-theme-muted'}
                  `}>
                    {ayah.translation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
