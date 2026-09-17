import { useState, useRef, useEffect, useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';

export type RepeatMode = 'none' | 'one' | 'all';
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentAyah: number;
  isLoading: boolean;
  isFinished: boolean;
  totalAyahs: number;
  repeatMode: RepeatMode;
  playbackSpeed: PlaybackSpeed;
  error: string | null;
}

interface AyahAudio {
  number: number;
  audio: string;
}

export function useAudioPlayer() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: settings.volume,
    currentAyah: 0,
    isLoading: false,
    isFinished: false,
    totalAyahs: 0,
    repeatMode: 'none',
    playbackSpeed: 1,
    error: null,
  });

  const [ayahAudioUrls, setAyahAudioUrls] = useState<string[]>([]);
  const isPlayingRef = useRef(false);
  const currentAyahRef = useRef(0);
  const ayahUrlsRef = useRef<string[]>([]);
  const repeatModeRef = useRef<RepeatMode>('none');
  const playbackSpeedRef = useRef<PlaybackSpeed>(1);

  useEffect(() => { ayahUrlsRef.current = ayahAudioUrls; }, [ayahAudioUrls]);
  useEffect(() => { repeatModeRef.current = state.repeatMode; }, [state.repeatMode]);
  useEffect(() => { playbackSpeedRef.current = state.playbackSpeed; }, [state.playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      const vol = typeof settings.volume === 'number' && !isNaN(settings.volume) ? settings.volume : 0.8;
      audioRef.current.volume = vol;
      setState(prev => ({ ...prev, volume: vol }));
    }
  }, [settings.volume]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = typeof settings.volume === 'number' && !isNaN(settings.volume) ? settings.volume : 0.8;
    audioRef.current = audio;

    const handleTimeUpdate = () => setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    const handleLoadedMetadata = () => setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    
    const handleEnded = () => {
      const urls = ayahUrlsRef.current;
      const repeat = repeatModeRef.current;
      const currentAyah = currentAyahRef.current;

      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (currentAyah < urls.length) {
        const nextAyah = currentAyah + 1;
        currentAyahRef.current = nextAyah;
        audio.src = urls[nextAyah - 1];
        audio.play().catch(() => {});
        setState(prev => ({ ...prev, currentAyah: nextAyah, isLoading: true }));
      } else if (repeat === 'all' && urls.length > 0) {
        currentAyahRef.current = 1;
        audio.src = urls[0];
        audio.play().catch(() => {});
        setState(prev => ({ ...prev, currentAyah: 1, isLoading: true }));
      } else {
        setState(prev => ({ ...prev, isPlaying: false, isLoading: false, isFinished: true, currentAyah: 0 }));
        isPlayingRef.current = false;
      }
    };

    const handleWaiting = () => setState(prev => ({ ...prev, isLoading: true }));
    const handleCanPlay = () => setState(prev => ({ ...prev, isLoading: false }));
    const handleError = () => {
      setState(prev => ({ ...prev, isLoading: false, error: 'Audio playback error' }));
      const urls = ayahUrlsRef.current;
      if (currentAyahRef.current < urls.length) {
        setTimeout(() => {
          const nextAyah = currentAyahRef.current + 1;
          currentAyahRef.current = nextAyah;
          audio.src = urls[nextAyah - 1];
          audio.play().catch(() => {});
          setState(prev => ({ ...prev, currentAyah: nextAyah, isLoading: true }));
        }, 300);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, []);

  const loadSurah = useCallback(async (surahNumber: number) => {
    if (!audioRef.current) return;

    try { audioRef.current.pause(); audioRef.current.removeAttribute('src'); audioRef.current.load(); } catch (e) {}
    isPlayingRef.current = false;
    currentAyahRef.current = 0;

    setState(prev => ({ ...prev, isLoading: true, isFinished: false, currentAyah: 0, isPlaying: false, currentTime: 0, duration: 0, error: null }));

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${settings.reciter}`);
      const data = await response.json();

      if (data.code === 200 && data.data?.ayahs) {
        const urls = data.data.ayahs.map((ayah: AyahAudio) => ayah.audio);
        setAyahAudioUrls(urls);
        ayahUrlsRef.current = urls;
        setState(prev => ({ ...prev, totalAyahs: urls.length }));

        if (urls.length > 0) {
          currentAyahRef.current = 1;
          isPlayingRef.current = true;
          audioRef.current.src = urls[0];
          setState(prev => ({ ...prev, currentAyah: 1, isLoading: true }));
          try { await audioRef.current.play(); } catch (e) {
            setTimeout(() => { audioRef.current?.play().catch(() => {}); }, 100);
          }
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading surah:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [settings.reciter]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (state.isPlaying) {
      try { audioRef.current.pause(); } catch (e) {}
      isPlayingRef.current = false;
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      if (currentAyahRef.current === 0 && ayahUrlsRef.current.length > 0) {
        currentAyahRef.current = 1;
        audioRef.current.src = ayahUrlsRef.current[0];
        setState(prev => ({ ...prev, currentAyah: 1, isLoading: true }));
      }
      isPlayingRef.current = true;
      audioRef.current.play().catch(() => {});
    }
  }, [state.isPlaying]);

  const setVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    const validVol = Math.max(0, Math.min(1, vol));
    try { audioRef.current.volume = validVol; } catch (e) {}
    setState(prev => ({ ...prev, volume: validVol }));
  }, []);

  const seekToAyah = useCallback((ayahNumber: number) => {
    if (!audioRef.current || ayahUrlsRef.current.length === 0) return;
    const index = ayahNumber - 1;
    if (index < 0 || index >= ayahUrlsRef.current.length) return;
    currentAyahRef.current = ayahNumber;
    isPlayingRef.current = true;
    audioRef.current.src = ayahUrlsRef.current[index];
    audioRef.current.play().catch(() => {});
    setState(prev => ({ ...prev, currentAyah: ayahNumber, isLoading: true, isPlaying: true }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    try { audioRef.current.pause(); audioRef.current.removeAttribute('src'); audioRef.current.load(); } catch (e) {}
    isPlayingRef.current = false;
    currentAyahRef.current = 0;
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, currentAyah: 0, duration: 0, isFinished: false, isLoading: false }));
  }, []);

  const nextAyah = useCallback(() => {
    if (!audioRef.current || ayahUrlsRef.current.length === 0) return;
    const next = currentAyahRef.current + 1;
    if (next <= ayahUrlsRef.current.length) {
      currentAyahRef.current = next;
      isPlayingRef.current = true;
      audioRef.current.src = ayahUrlsRef.current[next - 1];
      audioRef.current.play().catch(() => {});
      setState(prev => ({ ...prev, currentAyah: next, isLoading: true, isPlaying: true }));
    }
  }, []);

  const prevAyah = useCallback(() => {
    if (!audioRef.current || ayahUrlsRef.current.length === 0) return;
    const prevNum = currentAyahRef.current - 1;
    if (prevNum >= 1) {
      currentAyahRef.current = prevNum;
      isPlayingRef.current = true;
      audioRef.current.src = ayahUrlsRef.current[prevNum - 1];
      audioRef.current.play().catch(() => {});
      setState(prevState => ({ ...prevState, currentAyah: prevNum, isLoading: true, isPlaying: true }));
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: RepeatMode[] = ['none', 'one', 'all'];
      const nextMode = modes[(modes.indexOf(prev.repeatMode) + 1) % modes.length];
      repeatModeRef.current = nextMode;
      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  const cycleSpeed = useCallback(() => {
    setState(prev => {
      const speeds: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
      const nextSpeed = speeds[(speeds.indexOf(prev.playbackSpeed) + 1) % speeds.length];
      playbackSpeedRef.current = nextSpeed;
      if (audioRef.current) {
        try { audioRef.current.playbackRate = nextSpeed; } catch (e) {}
      }
      return { ...prev, playbackSpeed: nextSpeed };
    });
  }, []);

  return {
    state,
    loadSurah,
    togglePlay,
    setVolume,
    seekToAyah,
    stop,
    nextAyah,
    prevAyah,
    toggleRepeat,
    cycleSpeed,
  };
}
