import { AudioState, RepeatMode, PlaybackSpeed } from '../hooks/useAudioPlayer';
import { toPersianNumber } from '../utils/persianNumber';
import { useLanguage } from '../context/LanguageContext';

interface PlayerProps {
  state: AudioState;
  surahName: string;
  surahEnglishName: string;
  onTogglePlay: () => void;
  onToggleRepeat: () => void;
  onCycleSpeed: () => void;
  onOpenQuickSettings: () => void;
  onToggleImmersive: () => void;
  immersiveMode: boolean;
}

export function Player({
  state,
  surahName,
  surahEnglishName,
  onTogglePlay,
  onToggleRepeat,
  onCycleSpeed,
  onOpenQuickSettings,
  onToggleImmersive,
  immersiveMode,
}: PlayerProps) {
  const { t, language } = useLanguage();

  const getRepeatIcon = (mode: RepeatMode) => {
    if (mode === 'one') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
      </svg>
    );
  };

  const getSpeedLabel = (speed: PlaybackSpeed) => `${speed}x`;

  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s)) return '۰:۰۰';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return toPersianNumber(`${m}:${sec.toString().padStart(2, '0')}`);
  };

  return (
    <div className="bg-theme-primary/98 backdrop-blur-lg border-t border-theme">
      <div className="px-3 py-1.5 flex items-center justify-between gap-2">
        <span className="text-theme-muted text-[10px] sm:text-xs font-mono">
          {formatTime(state.currentTime)}
        </span>
        <div className="flex-1 h-1 bg-theme-tertiary relative group cursor-pointer">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-linear"
            style={{
              width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : '0%',
            }}
          />
        </div>
        <span className="text-theme-muted text-[10px] sm:text-xs font-mono">
          {formatTime(state.duration)}
        </span>
      </div>

      <div className="px-2 sm:px-4 pb-2 sm:pb-3 flex items-center justify-between gap-1">
        {/* Desktop: Immersive Mode Button */}
        <div className="hidden sm:flex items-center gap-2 flex-1">
          <button
            onClick={onToggleImmersive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              immersiveMode 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'text-theme-muted hover:text-theme-primary hover:bg-theme-hover'
            }`}
            title={language === 'fa' ? 'حالت مطالعه' : language === 'ar' ? 'وضع القراءة' : 'Reading Mode'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" className="w-5 h-5">
              <path d="M0 0h512v512H0z" fill="none" />
              <path fill="currentColor" fillRule="evenodd" d="M331.52 117.547c0 41.386-33.707 74.88-74.88 74.88c-41.387 0-74.88-33.494-74.88-74.88c0-41.387 33.493-74.88 74.88-74.88s74.88 33.493 74.88 74.88m-96.853 125.748L64 157.867v215.04l170.667 85.428zm42.666 215.681l171.947-86.069v-215.04l-171.947 86.069z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              {language === 'fa' ? 'مطالعه' : language === 'ar' ? 'قراءة' : 'Read'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0">
          <button
            onClick={onToggleRepeat}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
              state.repeatMode !== 'none' 
                ? 'text-emerald-400 bg-emerald-500/15 active:bg-emerald-500/25' 
                : 'text-theme-muted hover:text-theme-primary hover:bg-theme-hover active:bg-theme-tertiary'
            }`}
            title={state.repeatMode === 'none' ? t.repeatNone : state.repeatMode === 'one' ? t.repeatOne : t.repeatAll}
          >
            {getRepeatIcon(state.repeatMode)}
          </button>

          <button
            onClick={onTogglePlay}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-theme-primary border-2 border-theme flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            {state.isLoading && state.currentAyah > 0 && !state.isFinished ? (
              <svg className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : state.isPlaying ? (
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-theme-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-theme-primary mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button
            onClick={onCycleSpeed}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all ${
              state.playbackSpeed !== 1 
                ? 'text-emerald-400 bg-emerald-500/15 active:bg-emerald-500/25' 
                : 'text-theme-muted hover:text-theme-primary hover:bg-theme-hover active:bg-theme-tertiary'
            }`}
            title={`${t.speed}: ${state.playbackSpeed}x`}
          >
            {getSpeedLabel(state.playbackSpeed)}
          </button>

          <button
            onClick={onOpenQuickSettings}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-theme-muted hover:text-theme-primary hover:bg-theme-hover active:bg-theme-tertiary transition-all"
            title={t.settings}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M0 0h24v24H0z" fill="none" />
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
                <path d="M3 5h4m14 0H11m-8 7h12m6 0h-2M3 19h2m16 0H9" />
                <circle cx="9" cy="5" r="2" />
                <circle cx="17" cy="12" r="2" />
                <circle cx="7" cy="19" r="2" />
              </g>
            </svg>
          </button>
        </div>

        <div className="hidden sm:block flex-1"></div>
      </div>
    </div>
  );
}
