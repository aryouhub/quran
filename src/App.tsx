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
import { QuickSettingsPanel } from './components/QuickSettingsPanel';
import { BottomNavigation } from './components/BottomNavigation';

function App() {
  const { t, language } = useLanguage();
  const qs = quickSettingsTranslations[language];
  const si = surahInfoTranslations[language];
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [surahFilter, setSurahFilter] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [surahSearch, setSurahSearch] = useState('');
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [floatingControlsCollapsed, setFloatingControlsCollapsed] = useState(false);

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
      {/* Sidebar - Desktop Only (Full Height, Independent) - Hidden in Immersive Mode */}
      {!immersiveMode && desktopSidebarOpen && (
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

      {/* Sidebar - Desktop Only (Hidden in Immersive Mode) */}
      {!immersiveMode && desktopSidebarOpen && (
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
      <div className={`transition-all duration-300 ${immersiveMode ? 'pt-0 pb-20' : 'pt-14 pb-24'} ${!immersiveMode && desktopSidebarOpen ? 'md:pr-80 lg:pr-96 xl:pr-[28rem]' : ''}`}>
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
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setDesktopSidebarOpen(!desktopSidebarOpen);
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

      {/* Bottom Navigation - Mobile Only */}
      {!immersiveMode && (
        <BottomNavigation
          onOpenSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenNavigation={() => setNavigationOpen(!navigationOpen)}
          onOpenSettings={() => setSettingsOpen(!settingsOpen)}
          onOpenQuickSettings={() => setQuickSettingsOpen(!quickSettingsOpen)}
          onToggleImmersive={() => setImmersiveMode(!immersiveMode)}
          immersiveMode={immersiveMode}
          audioState={audioState}
          onTogglePlay={handleTogglePlay}
          onNext={nextAyah}
          onPrev={prevAyah}
          surahName={selectedSurah ? getSurahName(selectedSurah, language) : undefined}
        />
      )}

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
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setDesktopSidebarOpen(!desktopSidebarOpen);
                }
              }}      />

      {/* Player - Tablet & Desktop Only (Hidden in Immersive Mode) */}
      {!immersiveMode && (
        <div className={`hidden md:block fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ${desktopSidebarOpen ? 'md:mr-80 lg:mr-96 xl:mr-[28rem]' : ''}`}>
          <Player
            state={audioState}
            surahName={selectedSurah ? getSurahName(selectedSurah, language) : 'Quran'}
            surahEnglishName={selectedSurah?.englishName || 'Quran'}
            onTogglePlay={handleTogglePlay}
            onToggleRepeat={toggleRepeat}
            onCycleSpeed={cycleSpeed}
            onOpenQuickSettings={() => setQuickSettingsOpen(true)}
            onToggleImmersive={() => setImmersiveMode(!immersiveMode)}
            immersiveMode={immersiveMode}
          />
        </div>
      )}

      {/* Quick Settings Panel */}
      {quickSettingsOpen && (
        <QuickSettingsPanel
          isOpen={quickSettingsOpen}
          onClose={() => setQuickSettingsOpen(false)}
        />
      )}

      {/* Floating Controls - Immersive Mode Only */}
      {immersiveMode && (
        <>
          {/* Collapsed State - Single Floating Button */}
          {floatingControlsCollapsed ? (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => setFloatingControlsCollapsed(false)}
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all shadow-2xl group"
                title={language === 'fa' ? 'نمایش کنترل‌ها' : language === 'ar' ? 'عرض عناصر التحكم' : 'Show Controls'}
              >
                {/* Pulse Ring Animation */}
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-ring"></span>
                <span className="absolute inset-2 rounded-full bg-emerald-500 animate-pulse-ring" style={{ animationDelay: '0.5s' }}></span>
                
                {/* Floating Music Notes */}
                <span className="absolute -top-3 -right-1 text-emerald-200 animate-float-note-1 text-lg font-bold">♪</span>
                <span className="absolute -top-1 -left-3 text-teal-200 animate-float-note-2 text-xl font-bold">♫</span>
                <span className="absolute -bottom-2 right-0 text-emerald-300 animate-float-note-1 text-base" style={{ animationDelay: '1s' }}>♩</span>
                
                {/* Play/Pause Icon with Wave Effect */}
                <div className="relative z-10 flex items-center gap-0.5">
                  {audioState.isPlaying ? (
                    <>
                      <div className="w-1 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
                    </>
                  ) : (
                    <svg className="w-8 h-8 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          ) : (
            /* Expanded State - Full Control Bar */
            <div className="fixed bottom-6 left-0 right-0 z-50 px-4">
              <div className="max-w-2xl mx-auto overflow-x-auto scrollbar-hide">
                <div className="flex items-center justify-center gap-2 sm:gap-3 bg-theme-secondary/95 backdrop-blur-lg rounded-full px-3 sm:px-5 py-3 shadow-2xl border border-theme w-max mx-auto">
                  {/* Collapse Button */}
                  <button
                    onClick={() => setFloatingControlsCollapsed(true)}
                    className="w-10 h-10 rounded-full bg-theme-tertiary text-theme-primary flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-all shrink-0"
                    title={language === 'fa' ? 'جمع کردن' : language === 'ar' ? 'تصغير' : 'Collapse'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Surahs Button */}
                  <button
                    onClick={() => {
                      // Close other panels first
                      setNavigationOpen(false);
                      setQuickSettingsOpen(false);
                      setSettingsOpen(false);
                      
                      // Toggle sidebar
                      if (window.innerWidth < 768) {
                        setSidebarOpen(!sidebarOpen);
                      } else {
                        setDesktopSidebarOpen(!desktopSidebarOpen);
                      }
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      sidebarOpen || desktopSidebarOpen
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-theme-tertiary text-theme-primary hover:bg-emerald-500/20 hover:text-emerald-400'
                    }`}
                    title={t.surahs}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </button>

                  {/* Navigation Button */}
                  <button
                    onClick={() => {
                      // Close other panels first
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      } else {
                        setDesktopSidebarOpen(false);
                      }
                      setQuickSettingsOpen(false);
                      setSettingsOpen(false);
                      
                      // Toggle navigation
                      setNavigationOpen(!navigationOpen);
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      navigationOpen
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-theme-tertiary text-theme-primary hover:bg-emerald-500/20 hover:text-emerald-400'
                    }`}
                    title={language === 'fa' ? 'ناوبری' : language === 'ar' ? 'التنقل' : 'Navigation'}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </button>

                  {/* Quick Settings Button */}
                  <button
                    onClick={() => {
                      // Close other panels first
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      } else {
                        setDesktopSidebarOpen(false);
                      }
                      setNavigationOpen(false);
                      setSettingsOpen(false);
                      
                      // Toggle quick settings
                      setQuickSettingsOpen(!quickSettingsOpen);
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      quickSettingsOpen
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-theme-tertiary text-theme-primary hover:bg-emerald-500/20 hover:text-emerald-400'
                    }`}
                    title={qs.quickSettings}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
                        <path d="M3 5h4m14 0H11m-8 7h12m6 0h-2M3 19h2m16 0H9" />
                        <circle cx="9" cy="5" r="2" />
                        <circle cx="17" cy="12" r="2" />
                        <circle cx="7" cy="19" r="2" />
                      </g>
                    </svg>
                  </button>

                  {/* Play/Pause Button */}
                  <button
                    onClick={handleTogglePlay}
                    className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shrink-0"
                  >
                    {audioState.isPlaying ? (
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  {/* Full Settings Button */}
                  <button
                    onClick={() => {
                      // Close other panels first
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      } else {
                        setDesktopSidebarOpen(false);
                      }
                      setNavigationOpen(false);
                      setQuickSettingsOpen(false);
                      
                      // Toggle settings
                      setSettingsOpen(!settingsOpen);
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      settingsOpen
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-theme-tertiary text-theme-primary hover:bg-emerald-500/20 hover:text-emerald-400'
                    }`}
                    title={t.settings}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                    </svg>
                  </button>

                  {/* Exit Immersive Mode Button */}
                  <button
                    onClick={() => setImmersiveMode(false)}
                    className="w-11 h-11 rounded-full bg-theme-tertiary text-theme-primary flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0"
                    title={language === 'fa' ? 'خروج از حالت مطالعه' : language === 'ar' ? 'الخروج من وضع القراءة' : 'Exit Reading Mode'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
