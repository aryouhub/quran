import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  arabicFont: string;
  persianFont: string;
  reciter: string;
  translator: string;
  tafsir: string;
  showTranslation: boolean;
  showTafsir: boolean;
  volume: number;
  fontSize: number;
  playbackSpeed: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  arabicFont: 'amiri',
  persianFont: 'vazirmatn',
  reciter: 'ar.alafasy',
  translator: 'fa.makarem',
  tafsir: 'ar.muyassar',
  showTranslation: true,
  showTafsir: false,
  volume: 0.8,
  fontSize: 16,
  playbackSpeed: 1,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          volume: typeof parsed.volume === 'number' && !isNaN(parsed.volume) && parsed.volume >= 0 && parsed.volume <= 1
            ? parsed.volume
            : defaultSettings.volume,
          fontSize: typeof parsed.fontSize === 'number' && !isNaN(parsed.fontSize) && parsed.fontSize >= 8 && parsed.fontSize <= 32
            ? parsed.fontSize
            : defaultSettings.fontSize,
        };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-arabic-font', settings.arabicFont);
    document.documentElement.setAttribute('data-persian-font', settings.persianFont);
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
