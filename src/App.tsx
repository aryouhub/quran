import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Surah, surahs, getSurahName } from './data/surahs';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useSettings } from './context/SettingsContext';
import { useLanguage } from './context/LanguageContext';
import { toPersianNumber } from './utils/persianNumber';
import { quickSettingsTranslations, surahInfoTranslations, getRecitationStyle } from './data/translationHelpers';
import { juzData, hizbData } from './data/quranStructure';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { AyahDisplay } from './components/AyahDisplay';
import { SettingsPage } from './components/SettingsPage';
import { NavigationPanel } from './components/NavigationPanel';

function App() {
  const { t, language } = useLanguage();
  const qs = quickSettingsTranslations[language];
  const si = surahInfoTranslations[language];
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [surahFilter, setSurahFilter] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [surahSearch, setSurahSearch] = useState('');
  const [immersiveMode, setImmersiveMode] = useState(false);

  const {
    state: audioState,
    loadSurah,
    togglePlay,
    toggleRepeat,
    cycleSpeed,
    seekToAyah,
    nextAyah,
    prevAyah,
  } = useAudioPlayer();

  const handleSelectSurah = useCallback((surah: Surah) => {
    setSelectedSurah(surah);
    loadSurah(surah.number);
  }, [loadSurah]);

  const handleAyahClick = useCallback((ayahNumber: number) => {
    if (selectedSurah) {
      seekToAyah(ayahNumber);
    }
  }, [seekToAyah, selectedSurah]);

  const handleTogglePlay = useCallback(() => {
    if (!selectedSurah) {
      const firstSurah = surahs[0];
      setSelectedSurah(firstSurah);
      loadSurah(firstSurah.number);
    } else {
      togglePlay();
    }
  }, [selectedSurah, togglePlay, loadSurah]);

  const { settings } = useSettings();
  const prevSettingsRef = useRef({ reciter: settings.reciter, translator: settings.translator });
  
  useEffect(() => {
    const prevSettings = prevSettingsRef.current;
    const hasChanged = 
      prevSettings.reciter !== settings.reciter || 
      prevSettings.translator !== settings.translator;
    
    if (hasChanged && selectedSurah) {
      loadSurah(selectedSurah.number);
      prevSettingsRef.current = { reciter: settings.reciter, translator: settings.translator };
    }
  }, [settings.reciter, settings.translator, selectedSurah, loadSurah]);

  const currentJuz = useMemo(() => {
    if (!selectedSurah || !audioState.currentAyah) return null;
    return juzData.find(j => {
      const start = j.startSurah * 1000 + j.startAyah;
      const end = j.endSurah * 1000 + j.endAyah;
      const current = selectedSurah.number * 1000 + audioState.currentAyah;
      return current >= start && current <= end;
    });
  }, [selectedSurah, audioState.currentAyah]);

  const currentHizb = useMemo(() => {
    if (!selectedSurah || !audioState.currentAyah) return null;
    return hizbData.find(h => {
      const start = h.startSurah * 1000 + h.startAyah;
      const end = h.endSurah * 1000 + h.endAyah;
      const current = selectedSurah.number * 1000 + audioState.currentAyah;
      return current >= start && current <= end;
    });
  }, [selectedSurah, audioState.currentAyah]);

  const filteredSurahs = useMemo(() => {
    return surahs.filter(surah => {
      const localizedName = getSurahName(surah, language);
      const matchesSearch = !surahSearch || 
        surah.name.includes(surahSearch) ||
        surah.persianName.includes(surahSearch) ||
        surah.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
        localizedName.toLowerCase().includes(surahSearch.toLowerCase()) ||
        surah.number.toString() === surahSearch;
      
      const matchesFilter = surahFilter === 'all' ||
        (surahFilter === 'meccan' && surah.revelationType === 'Meccan') ||
        (surahFilter === 'medinan' && surah.revelationType === 'Medinan');
      
      return matchesSearch && matchesFilter;
    });
  }, [surahFilter, surahSearch, language]);

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      {/* Sidebar - Desktop Only (Full Height, Independent) */}
      {desktopSidebarOpen && (
        <aside className="hidden md:block fixed top-0 right-0 w-80 lg:w-96 xl:w-[28rem] h-screen bg-theme-primary border-l border-theme z-20 transition-all duration-300">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-theme">
              <h2 className="text-theme-primary text-lg font-bold flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                </svg>
                <span>{t.surahs}</span>
              </h2>
              
              {/* Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder={t.searchSurah}
                  value={surahSearch}
                  onChange={(e) => setSurahSearch(e.target.value)}
                  className="w-full bg-theme-secondary text-theme-primary rounded-lg px-4 py-2.5 pr-10
                             border border-theme focus:border-emerald-500 focus:outline-none
                             placeholder-theme-dim text-sm"
                />
                <svg className="absolute right-3 top-3 w-4 h-4 text-theme-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSurahFilter('all')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    surahFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  {t.all}
                </button>
                <button
                  onClick={() => setSurahFilter('meccan')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    surahFilter === 'meccan' ? 'bg-emerald-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  {t.meccan}
                </button>
                <button
                  onClick={() => setSurahFilter('medinan')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    surahFilter === 'medinan' ? 'bg-emerald-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  {t.medinan}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-theme-hover transition-colors text-right border-b border-theme ${
                    selectedSurah?.number === surah.number ? 'bg-emerald-900/20 border-r-2 border-r-emerald-500' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-theme-tertiary flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {toPersianNumber(surah.number)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-theme-primary font-medium text-sm truncate">{getSurahName(surah, language)}</span>
                      <span className="text-emerald-400 text-sm shrink-0">{surah.name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-theme-muted text-xs">{toPersianNumber(surah.numberOfAyahs)} {t.ayah}</span>
                      <span className={`text-xs ${surah.revelationType === 'Meccan' ? 'text-amber-400/70' : 'text-blue-400/70'}`}>
                        {surah.revelationType === 'Meccan' ? t.meccan : t.medinan}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Header - Hidden in Immersive Mode */}
      {!immersiveMode && (
        <div className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${desktopSidebarOpen ? 'md:mr-80 lg:mr-96 xl:mr-[28rem]' : ''}`}>
          <Header 
            onToggleSidebar={() => {
              if (window.innerWidth < 768) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setDesktopSidebarOpen(!desktopSidebarOpen);
              }
            }}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenNavigation={() => setNavigationOpen(true)}
            onToggleImmersive={() => setImmersiveMode(!immersiveMode)}
            immersiveMode={immersiveMode}
          />
        </div>
      )}

      {/* Main Content Area - Adaptive Layout */}
      <div className={`transition-all duration-300 ${immersiveMode ? 'pt-0 pb-0' : 'pt-14 pb-24'} ${desktopSidebarOpen ? 'md:pr-80 lg:pr-96 xl:pr-[28rem]' : ''}`}>
        <main className="min-h-screen">
          {/* Surah Info - Hidden in Immersive Mode */}
          {selectedSurah && !immersiveMode && (
            <div className="px-4 sm:px-6 py-4 border-b border-theme/50">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-lg sm:text-xl font-bold text-theme-primary mb-1">
                  {getSurahName(selectedSurah, language)}
                </h2>
                <p className="text-theme-muted text-xs">
                  {t.ayah} {toPersianNumber(audioState.currentAyah || 1)} {qs.from} {toPersianNumber(selectedSurah.numberOfAyahs)}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                    selectedSurah.revelationType === 'Meccan'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {selectedSurah.revelationType === 'Meccan' ? t.meccan : t.medinan}
                  </span>
                  {currentJuz && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {si.juz} {toPersianNumber(currentJuz.number)}
                    </span>
                  )}
                  {currentHizb && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {si.hizb} {toPersianNumber(currentHizb.number)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={`overflow-y-auto ${immersiveMode ? 'h-screen' : ''}`}>
            <AyahDisplay
              surahNumber={selectedSurah?.number || 0}
              currentAyah={audioState.currentAyah}
              onAyahClick={handleAyahClick}
              isLoading={audioState.isLoading && audioState.currentAyah === 0 && !audioState.isFinished}
              onOpenSidebar={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(true);
                } else {
                  setDesktopSidebarOpen(true);
                }
              }}
              immersiveMode={immersiveMode}
            />
          </div>
        </main>
      </div>

      {/* Sidebar - Mobile Only (Overlay) */}
      <div className="md:hidden">
        <Sidebar
          selectedSurah={selectedSurah}
          onSelectSurah={handleSelectSurah}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Settings Page */}
      {settingsOpen && (
        <SettingsPage
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Navigation Panel */}
      <NavigationPanel
        isOpen={navigationOpen}
        onClose={() => setNavigationOpen(false)}
        onNavigate={(surah, ayah) => {
          const surahData = surahs.find(s => s.number === surah);
          if (surahData) {
            if (selectedSurah?.number !== surah) {
              setSelectedSurah(surahData);
              loadSurah(surah);
            }
            if (ayah) {
              seekToAyah(ayah);
            }
          }
        }}
        currentSurah={selectedSurah?.number}
        currentAyah={audioState.currentAyah}
        onOpenSidebar={() => {
          if (window.innerWidth < 768) {
            setSidebarOpen(true);
          } else {
            setDesktopSidebarOpen(true);
          }
        }}
      />

      {/* Player - Tablet & Desktop Only */}
      <div className={`hidden md:block fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ${desktopSidebarOpen ? 'md:mr-80 lg:mr-96 xl:mr-[28rem]' : ''}`}>
        <Player
          state={audioState}
          surahName={selectedSurah ? getSurahName(selectedSurah, language) : 'Quran'}
          surahEnglishName={selectedSurah?.englishName || 'Quran'}
          onTogglePlay={handleTogglePlay}
          onToggleRepeat={toggleRepeat}
          onCycleSpeed={cycleSpeed}
          onOpenQuickSettings={() => setSettingsOpen(true)}
          onToggleImmersive={() => setImmersiveMode(!immersiveMode)}
          immersiveMode={immersiveMode}
        />
      </div>
    </div>
  );
}

export default App;
