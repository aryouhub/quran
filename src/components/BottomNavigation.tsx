import { useLanguage } from '../context/LanguageContext';
import { AudioState } from '../hooks/useAudioPlayer';

interface BottomNavigationProps {
  onOpenSidebar: () => void;
  onOpenNavigation: () => void;
  onOpenSettings: () => void;
  onOpenQuickSettings: () => void;
  onToggleImmersive: () => void;
  immersiveMode: boolean;
  audioState: AudioState;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  surahName?: string;
}

export function BottomNavigation({
  onOpenSidebar,
  onOpenNavigation,
  onOpenSettings,
  onOpenQuickSettings,
  onToggleImmersive,
  immersiveMode,
  audioState,
  onTogglePlay,
  onNext,
  onPrev,
  surahName,
}: BottomNavigationProps) {
  const { t, language } = useLanguage();

  // If surah is selected, show player mode
  const showPlayer = surahName && !audioState.isFinished;

  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s)) return '۰:۰۰';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return `${m}:${sec.toString().padStart(2, '0')}`.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-theme-primary/95 backdrop-blur-lg border-t border-theme z-30 md:hidden safe-area-bottom">
      {showPlayer ? (
        // Player Mode
        <div className="px-3 py-2">
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="h-1 bg-theme-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: audioState.duration > 0 ? `${(audioState.currentTime / audioState.duration) * 100}%` : '0%',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-theme-muted mt-1 font-mono">
              <span>{formatTime(audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Surah Info */}
            <div className="flex-1 min-w-0 text-right">
              <p className="text-theme-primary text-xs font-semibold truncate">{surahName}</p>
              <p className="text-theme-muted text-[10px]">
                {t.ayah} {audioState.currentAyah} {language === 'fa' ? 'از' : language === 'ar' ? 'من' : 'of'} {audioState.totalAyahs}
              </p>
            </div>

            {/* Player Controls */}
            <div className="flex items-center gap-1">
              {/* Previous */}
              <button
                onClick={onPrev}
                disabled={audioState.currentAyah <= 1}
                className="w-10 h-10 rounded-full flex items-center justify-center text-theme-muted hover:text-theme-primary hover:bg-theme-hover active:bg-theme-tertiary transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={onTogglePlay}
                className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
              >
                {audioState.isLoading ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : audioState.isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                disabled={audioState.currentAyah >= audioState.totalAyahs}
                className="w-10 h-10 rounded-full flex items-center justify-center text-theme-muted hover:text-theme-primary hover:bg-theme-hover active:bg-theme-tertiary transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>

              {/* Quick Settings */}
              <button
                onClick={onOpenQuickSettings}
                className="w-10 h-10 rounded-full flex items-center justify-center text-theme-muted hover:text-theme-primary hover:bg-theme-hover active:bg-theme-tertiary transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Navigation Mode
        <div className="flex items-center justify-around px-2 py-2">
          {/* Surahs */}
          <button
            onClick={onOpenSidebar}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-theme-hover transition-colors"
          >
            <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs text-theme-muted">{t.surahs}</span>
          </button>

          {/* Navigation */}
          <button
            onClick={onOpenNavigation}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-theme-hover transition-colors"
          >
            <svg className="w-6 h-6 text-theme-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="text-xs text-theme-muted">
              {language === 'fa' ? 'ناوبری' : language === 'ar' ? 'التنقل' : 'Navigate'}
            </span>
          </button>

          {/* Immersive Mode */}
          <button
            onClick={onToggleImmersive}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              immersiveMode ? 'bg-emerald-500/10' : 'hover:bg-theme-hover'
            }`}
          >
            <svg className={`w-6 h-6 ${immersiveMode ? 'text-emerald-500' : 'text-theme-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className={`text-xs ${immersiveMode ? 'text-emerald-500' : 'text-theme-muted'}`}>
              {language === 'fa' ? 'مطالعه' : language === 'ar' ? 'قراءة' : 'Read'}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-theme-hover transition-colors"
          >
            <svg className="w-6 h-6 text-theme-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            <span className="text-xs text-theme-muted">{t.settings}</span>
          </button>
        </div>
      )}
    </nav>
  );
}
