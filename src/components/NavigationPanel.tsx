import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { surahs, getSurahName } from '../data/surahs';
import { juzData, hizbData } from '../data/quranStructure';
import { toPersianNumber } from '../utils/persianNumber';
import { surahInfoTranslations } from '../data/translationHelpers';

interface NavigationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (surah: number, ayah?: number) => void;
  currentSurah?: number;
  currentAyah?: number;
  onOpenSidebar?: () => void;
}

type TabType = 'ayah' | 'hizb' | 'juz';

export function NavigationPanel({ 
  isOpen, 
  onClose, 
  onNavigate,
  currentSurah,
  currentAyah,
  onOpenSidebar
}: NavigationPanelProps) {
  const { language } = useLanguage();
  const si = surahInfoTranslations[language];
  const [activeTab, setActiveTab] = useState<TabType>('ayah');

  // Get current surah data
  const currentSurahData = useMemo(() => {
    return surahs.find(s => s.number === currentSurah);
  }, [currentSurah]);

  // Filter hizb and juz based on current surah
  const currentSurahHizbs = useMemo(() => {
    if (!currentSurah) return [];
    return hizbData.filter(hizb => {
      return hizb.startSurah <= currentSurah && hizb.endSurah >= currentSurah;
    });
  }, [currentSurah]);

  const currentSurahJuzs = useMemo(() => {
    if (!currentSurah) return [];
    return juzData.filter(juz => {
      return juz.startSurah <= currentSurah && juz.endSurah >= currentSurah;
    });
  }, [currentSurah]);

  // Find current hizb and juz
  const currentHizb = useMemo(() => {
    if (!currentSurah || !currentAyah) return null;
    return hizbData.find(h => {
      const start = h.startSurah * 1000 + h.startAyah;
      const end = h.endSurah * 1000 + h.endAyah;
      const current = currentSurah * 1000 + currentAyah;
      return current >= start && current <= end;
    });
  }, [currentSurah, currentAyah]);

  const currentJuz = useMemo(() => {
    if (!currentSurah || !currentAyah) return null;
    return juzData.find(j => {
      const start = j.startSurah * 1000 + j.startAyah;
      const end = j.endSurah * 1000 + j.endAyah;
      const current = currentSurah * 1000 + currentAyah;
      return current >= start && current <= end;
    });
  }, [currentSurah, currentAyah]);

  if (!isOpen) return null;

  // Show message if no surah is selected
  if (!currentSurahData) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="fixed inset-0 bg-theme-primary z-50 overflow-y-auto">
          <div className="sticky top-0 bg-theme-primary/95 backdrop-blur-md border-b border-theme px-4 py-3 flex items-center justify-between z-10">
            <h1 className="text-theme-primary text-xl font-bold">
              {language === 'fa' ? 'ناوبری' : language === 'ar' ? 'التنقل' : 'Navigation'}
            </h1>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center p-8 min-h-[400px]">
            <div className="text-center max-w-md">
              <svg 
                className="w-20 h-20 text-theme-muted mx-auto mb-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-theme-primary text-xl font-bold mb-2">
                {language === 'fa' ? 'لطفاً ابتدا یک سوره انتخاب کنید' : 
                 language === 'ar' ? 'الرجاء اختيار سورة أولاً' : 
                 'Please select a surah first'}
              </h3>
              <p className="text-theme-muted text-sm mb-6">
                {language === 'fa' ? 'برای انتخاب سوره، روی دکمه زیر کلیک کنید' : 
                 language === 'ar' ? 'لاختيار سورة، انقر على الزر أدناه' : 
                 'Click the button below to select a surah'}
              </p>
              {onOpenSidebar && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSidebar();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>
                    {language === 'fa' ? 'انتخاب سوره' : 
                     language === 'ar' ? 'اختر سورة' : 
                     'Select Surah'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { id: 'ayah' as TabType, label: language === 'fa' ? 'آیه' : language === 'ar' ? 'آية' : 'Ayah' },
    { id: 'hizb' as TabType, label: language === 'fa' ? 'حزب' : language === 'ar' ? 'حزب' : 'Hizb' },
    { id: 'juz' as TabType, label: language === 'fa' ? 'جزء' : language === 'ar' ? 'جزء' : 'Juz' },
  ];

  const handleAyahSelect = (ayahNumber: number) => {
    onNavigate(currentSurah!, ayahNumber);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleHizbSelect = (hizbNumber: number) => {
    const hizb = hizbData.find(h => h.number === hizbNumber);
    if (hizb) {
      const startAyah = hizb.startSurah === currentSurah ? hizb.startAyah : 1;
      onNavigate(currentSurah!, startAyah);
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  const handleJuzSelect = (juzNumber: number) => {
    const juz = juzData.find(j => j.number === juzNumber);
    if (juz) {
      const startAyah = juz.startSurah === currentSurah ? juz.startAyah : 1;
      onNavigate(currentSurah!, startAyah);
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 bg-theme-primary z-50 overflow-y-auto">
        <div className="sticky top-0 bg-theme-primary/95 backdrop-blur-lg z-10">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-theme-primary text-lg font-bold">
                {language === 'fa' ? 'ناوبری' : language === 'ar' ? 'التنقل' : 'Navigation'}
              </h2>
              <p className="text-theme-muted text-xs mt-1">
                {getSurahName(currentSurahData, language)} • {currentSurahData.englishName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {currentJuz && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                  </svg>
                  {si.juz} {toPersianNumber(currentJuz.number)}
                </span>
              )}
              {currentHizb && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  {si.hizb} {toPersianNumber(currentHizb.number)}
                </span>
              )}
              {currentAyah && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {language === 'fa' ? 'آیه' : language === 'ar' ? 'آية' : 'Ayah'} {toPersianNumber(currentAyah)}
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-theme-primary to-transparent z-10 pointer-events-none opacity-0" id="nav-tabs-fade-left" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-theme-primary to-transparent z-10 pointer-events-none opacity-0" id="nav-tabs-fade-right" />
            
            <div 
              className="flex border-b border-theme overflow-x-auto scrollbar-hide"
              id="nav-tabs-container"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                const fadeLeft = document.getElementById('nav-tabs-fade-left');
                const fadeRight = document.getElementById('nav-tabs-fade-right');
                
                if (fadeLeft && fadeRight) {
                  fadeLeft.style.opacity = target.scrollLeft > 0 ? '1' : '0';
                  fadeRight.style.opacity = target.scrollLeft < target.scrollWidth - target.clientWidth - 1 ? '1' : '0';
                }
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-emerald-500'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'ayah' && (
            <div className="space-y-4">
              <div>
                <label className="text-theme-primary text-sm font-medium mb-2 block">
                  {language === 'fa' ? 'آیه' : language === 'ar' ? 'آية' : 'Ayah'} ({toPersianNumber(currentSurahData.numberOfAyahs)})
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[400px] overflow-y-auto">
                  {Array.from({ length: currentSurahData.numberOfAyahs }, (_, i) => i + 1).map((ayahNum) => (
                    <button
                      key={ayahNum}
                      onClick={() => handleAyahSelect(ayahNum)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        currentAyah === ayahNum
                          ? 'bg-emerald-500 text-white'
                          : 'bg-theme-secondary text-theme-primary hover:bg-theme-hover'
                      }`}
                    >
                      {toPersianNumber(ayahNum)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hizb' && (
            <div>
              <label className="text-theme-primary text-sm font-medium mb-2 block">
                {language === 'fa' ? 'حزب‌های سوره' : language === 'ar' ? 'أحزاب السورة' : 'Hizbs in Surah'} ({toPersianNumber(currentSurahHizbs.length)})
              </label>
              {currentSurahHizbs.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto">
                  {currentSurahHizbs.map((hizb) => (
                    <button
                      key={hizb.number}
                      onClick={() => handleHizbSelect(hizb.number)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentHizb?.number === hizb.number
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          currentHizb?.number === hizb.number
                            ? 'text-emerald-400'
                            : 'text-theme-primary'
                        }`}>
                          {toPersianNumber(hizb.number)}
                        </div>
                        <div className="text-xs text-theme-muted">
                          {si.juz} {toPersianNumber(hizb.juz)}
                        </div>
                        <div className="text-[10px] text-theme-dim mt-1">
                          {language === 'fa' ? 'آیه' : language === 'ar' ? 'آية' : 'Ayah'} {toPersianNumber(hizb.startAyah)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-theme-muted">
                  {language === 'fa' ? 'حزبی برای این سوره موجود نیست' : language === 'ar' ? 'لا توجد أحزاب لهذه السورة' : 'No hizbs available for this surah'}
                </div>
              )}
            </div>
          )}

          {activeTab === 'juz' && (
            <div className="space-y-2">
              <label className="text-theme-primary text-sm font-medium mb-2 block">
                {language === 'fa' ? 'جزء‌های سوره' : language === 'ar' ? 'أجزاء السورة' : 'Juz in Surah'} ({toPersianNumber(currentSurahJuzs.length)})
              </label>
              {currentSurahJuzs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {currentSurahJuzs.map((juz) => (
                    <button
                      key={juz.number}
                      onClick={() => handleJuzSelect(juz.number)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentJuz?.number === juz.number
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          currentJuz?.number === juz.number
                            ? 'text-emerald-400'
                            : 'text-theme-primary'
                        }`}>
                          {toPersianNumber(juz.number)}
                        </div>
                        <div className="text-xs text-theme-muted font-arabic">
                          {juz.name}
                        </div>
                        <div className="text-[10px] text-theme-dim mt-1">
                          {surahs.find(s => s.number === juz.startSurah)?.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-theme-muted">
                  {language === 'fa' ? 'جزئی برای این سوره موجود نیست' : language === 'ar' ? 'لا توجد أجزاء لهذه السورة' : 'No juz available for this surah'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
