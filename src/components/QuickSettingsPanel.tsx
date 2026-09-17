import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { quickSettingsTranslations } from '../data/translationHelpers';
import { reciters, translators } from '../data/fontsAndReciters';
import { getRecitationStyle } from '../data/translationHelpers';

interface QuickSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSettingsPanel({ isOpen, onClose }: QuickSettingsPanelProps) {
  const { settings, updateSettings } = useSettings();
  const { language } = useLanguage();
  const qs = quickSettingsTranslations[language];
  const [activeTab, setActiveTab] = useState<'reciter' | 'translator' | 'speed' | 'display'>('reciter');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const tabsContainer = document.getElementById('tabs-container');
        const fadeLeft = document.getElementById('tabs-fade-left');
        const fadeRight = document.getElementById('tabs-fade-right');
        
        if (tabsContainer && fadeLeft && fadeRight) {
          fadeLeft.style.opacity = tabsContainer.scrollLeft > 0 ? '1' : '0';
          fadeRight.style.opacity = tabsContainer.scrollLeft < tabsContainer.scrollWidth - tabsContainer.clientWidth - 1 ? '1' : '0';
        }
      }, 100);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'reciter' as const, label: qs.selectReciter },
    { id: 'translator' as const, label: qs.selectTranslator },
    { id: 'speed' as const, label: qs.playbackSpeed },
    { id: 'display' as const, label: qs.showTranslation },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 bg-theme-primary z-50 overflow-y-auto">
        <div className="sticky top-0 bg-theme-primary/95 backdrop-blur-lg z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-theme-primary text-lg font-bold">{qs.quickSettings}</h2>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-theme-primary to-transparent z-10 pointer-events-none opacity-0" id="tabs-fade-left" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-theme-primary to-transparent z-10 pointer-events-none opacity-0" id="tabs-fade-right" />
            
            <div 
              className="flex border-b border-theme overflow-x-auto scrollbar-hide"
              id="tabs-container"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                const fadeLeft = document.getElementById('tabs-fade-left');
                const fadeRight = document.getElementById('tabs-fade-right');
                
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
          {activeTab === 'reciter' && (
            <div className="space-y-2">
              {reciters.filter(r => r.available).map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => {
                    updateSettings({ reciter: reciter.id });
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.reciter === reciter.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    settings.reciter === reciter.id ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-base ${
                        settings.reciter === reciter.id ? 'text-emerald-400' : 'text-theme-primary'
                      }`}>
                        {reciter.name[language]}
                      </h3>
                      {settings.reciter === reciter.id && (
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {qs.current}
                        </span>
                      )}
                    </div>
                    <p className="text-theme-muted text-sm mt-0.5">
                      {getRecitationStyle(reciter.style, language)} • {reciter.country[language]}
                    </p>
                  </div>
                  {settings.reciter === reciter.id && (
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'translator' && (
            <div className="space-y-2">
              {translators.filter(t => t.available).map((translator) => (
                <button
                  key={translator.id}
                  onClick={() => {
                    updateSettings({ translator: translator.id });
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.translator === translator.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    settings.translator === translator.id ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-base ${
                        settings.translator === translator.id ? 'text-emerald-400' : 'text-theme-primary'
                      }`}>
                        {translator.name}
                      </h3>
                      {settings.translator === translator.id && (
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {qs.current}
                        </span>
                      )}
                    </div>
                    <p className="text-theme-muted text-sm mt-0.5">
                      {translator.language[language]} • {translator.country[language]}
                    </p>
                  </div>
                  {settings.translator === translator.id && (
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'speed' && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 0.5, label: '0.5x' },
                { value: 0.75, label: '0.75x' },
                { value: 1, label: '1x' },
                { value: 1.25, label: '1.25x' },
                { value: 1.5, label: '1.5x' },
                { value: 2, label: '2x' }
              ].map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => {
                    updateSettings({ playbackSpeed: speed.value as any });
                    onClose();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.playbackSpeed === speed.value
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`text-2xl font-bold ${
                    settings.playbackSpeed === speed.value ? 'text-emerald-400' : 'text-theme-primary'
                  }`}>
                    {speed.label}
                  </div>
                  {settings.playbackSpeed === speed.value && (
                    <div className="text-emerald-400 text-xs mt-1 font-medium">
                      {qs.current}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-theme-secondary border border-theme">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-theme-primary font-medium">{qs.showTranslation}</h3>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.showTranslation ? 'bg-emerald-500' : 'bg-theme-tertiary'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      settings.showTranslation ? 'right-0.5' : 'right-6'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-theme-secondary border border-theme">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-theme-primary font-medium">{qs.showTafsir}</h3>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ showTafsir: !settings.showTafsir })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.showTafsir ? 'bg-emerald-500' : 'bg-theme-tertiary'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      settings.showTafsir ? 'right-0.5' : 'right-6'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
