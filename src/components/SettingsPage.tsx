import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { reciters, translators, arabicFonts, persianFonts } from '../data/fontsAndReciters';
import { Language, languageNames } from '../data/translations';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPage({ isOpen, onClose }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!activeSection) {
    return (
      <>
        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed inset-0 bg-theme-primary z-50 overflow-y-auto">
          <div className="sticky top-0 bg-theme-primary/95 backdrop-blur-md border-b border-theme px-4 py-3 flex items-center justify-between z-10">
            <h1 className="text-theme-primary text-xl font-bold">{t.settings}</h1>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-theme-muted text-sm font-semibold mb-2 px-2">{t.displayMode}</h3>
              <div className="bg-theme-secondary rounded-xl overflow-hidden space-y-1 p-2">
                <SettingsItem
                  icon={<ThemeIcon />}
                  title={t.displayMode}
                  subtitle={theme === 'light' ? t.light : theme === 'dark' ? t.dark : t.system}
                  onClick={() => setActiveSection('theme')}
                />
                <SettingsItem
                  icon={<LanguageIcon />}
                  title={t.language}
                  subtitle={languageNames[language]}
                  onClick={() => setActiveSection('language')}
                />
                <SettingsItem
                  icon={<FontIcon />}
                  title={t.fontSize}
                  subtitle={`${settings.fontSize}px`}
                  onClick={() => setActiveSection('fontSize')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-theme-muted text-sm font-semibold mb-2 px-2">{t.audioSettings}</h3>
              <div className="bg-theme-secondary rounded-xl overflow-hidden space-y-1 p-2">
                <SettingsItem
                  icon={<VolumeIcon />}
                  title={t.volume}
                  subtitle={`${Math.round(settings.volume * 100)}%`}
                  onClick={() => setActiveSection('volume')}
                />
                <SettingsItem
                  icon={<ReciterIcon />}
                  title={t.reciter}
                  subtitle={reciters.find(r => r.id === settings.reciter)?.name[language] || ''}
                  onClick={() => setActiveSection('reciter')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-theme-muted text-sm font-semibold mb-2 px-2">{t.showTranslation}</h3>
              <div className="bg-theme-secondary rounded-xl overflow-hidden space-y-1 p-2">
                <SettingsItem
                  icon={<TranslationIcon />}
                  title={t.translator}
                  subtitle={translators.find(tr => tr.id === settings.translator)?.name || ''}
                  onClick={() => setActiveSection('translator')}
                />
                <ToggleItem
                  icon={<TranslationIcon />}
                  title={t.showTranslation}
                  checked={settings.showTranslation}
                  onChange={(checked) => updateSettings({ showTranslation: checked })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-theme-muted text-sm font-semibold mb-2 px-2">{t.arabicFontTitle}</h3>
              <div className="bg-theme-secondary rounded-xl overflow-hidden space-y-1 p-2">
                <SettingsItem
                  icon={<ArabicFontIcon />}
                  title={t.arabicFontTitle}
                  subtitle={arabicFonts.find(f => f.id === settings.arabicFont)?.name[language] || ''}
                  onClick={() => setActiveSection('arabicFont')}
                />
                <SettingsItem
                  icon={<PersianFontIcon />}
                  title={t.persianFontTitle}
                  subtitle={persianFonts.find(f => f.id === settings.persianFont)?.name[language] || ''}
                  onClick={() => setActiveSection('persianFont')}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 bg-theme-primary z-50 overflow-y-auto">
        <div className="sticky top-0 bg-theme-primary/95 backdrop-blur-md border-b border-theme px-4 py-3 flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveSection(null)}
            className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
          >
            <svg className="w-6 h-6 rtl-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-theme-primary text-xl font-bold">
            {activeSection === 'theme' && t.displayMode}
            {activeSection === 'language' && t.language}
            {activeSection === 'fontSize' && t.fontSize}
            {activeSection === 'volume' && t.volume}
            {activeSection === 'reciter' && t.reciter}
            {activeSection === 'translator' && t.translator}
            {activeSection === 'arabicFont' && t.arabicFontTitle}
            {activeSection === 'persianFont' && t.persianFontTitle}
          </h1>
        </div>

        <div className="p-4">
          {activeSection === 'theme' && (
            <div className="space-y-3">
              {(['light', 'dark', 'system'] as const).map((themeValue) => (
                <button
                  key={themeValue}
                  onClick={() => setTheme(themeValue)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    theme === themeValue
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === themeValue ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    <ThemeIcon />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`font-semibold text-base ${
                      theme === themeValue ? 'text-emerald-400' : 'text-theme-primary'
                    }`}>
                      {themeValue === 'light' && t.light}
                      {themeValue === 'dark' && t.dark}
                      {themeValue === 'system' && t.system}
                    </h3>
                    <p className="text-theme-muted text-sm mt-0.5">
                      {themeValue === 'light' && t.lightDescription}
                      {themeValue === 'dark' && t.darkDescription}
                      {themeValue === 'system' && t.systemDescription}
                    </p>
                  </div>
                  {theme === themeValue && (
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeSection === 'language' && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(languageNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as Language)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    language === code
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    language === code ? 'text-emerald-400' : 'text-theme-primary'
                  }`}>
                    {name}
                  </span>
                  {language === code && (
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeSection === 'fontSize' && (
            <div className="space-y-4 p-4 bg-theme-secondary rounded-xl">
              <div>
                <label className="text-theme-primary font-medium mb-2 block">{t.textSize}</label>
                <div className="flex items-center gap-3">
                  <span className="text-theme-muted text-xs">A</span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={typeof settings.fontSize === 'number' && !isNaN(settings.fontSize) ? settings.fontSize : 16}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 12 && value <= 24) {
                        updateSettings({ fontSize: value });
                      }
                    }}
                    className="flex-1 h-2 bg-theme-tertiary rounded-lg appearance-none cursor-pointer"
                    dir="ltr"
                  />
                  <span className="text-theme-muted text-lg">A</span>
                </div>
                <p className="text-theme-muted text-xs mt-2 text-center">
                  {(typeof settings.fontSize === 'number' && !isNaN(settings.fontSize) ? settings.fontSize : 16)}px
                </p>
              </div>
              <div className="mt-4 p-3 bg-theme-tertiary rounded-lg">
                <p className="text-theme-secondary text-center" style={{ fontSize: `${typeof settings.fontSize === 'number' && !isNaN(settings.fontSize) ? settings.fontSize : 16}px` }}>
                  {t.fontSizePreview}
                </p>
              </div>
            </div>
          )}

          {activeSection === 'volume' && (
            <div className="space-y-4 p-4 bg-theme-secondary rounded-xl">
              <div>
                <label className="text-theme-primary font-medium mb-2 block">{t.volume}</label>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-theme-muted" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={typeof settings.volume === 'number' && !isNaN(settings.volume) ? settings.volume : 0.8}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 1) {
                        updateSettings({ volume: value });
                      }
                    }}
                    className="flex-1 h-2 bg-theme-tertiary rounded-lg appearance-none cursor-pointer"
                    dir="ltr"
                  />
                  <svg className="w-5 h-5 text-theme-muted" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                </div>
                <p className="text-theme-muted text-xs mt-2 text-center">
                  {Math.round((typeof settings.volume === 'number' && !isNaN(settings.volume) ? settings.volume : 0.8) * 100)}%
                </p>
              </div>
            </div>
          )}

          {activeSection === 'reciter' && (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {reciters.filter(r => r.available).map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => updateSettings({ reciter: reciter.id })}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.reciter === reciter.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    settings.reciter === reciter.id ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    <ReciterIcon />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`font-semibold text-base ${
                      settings.reciter === reciter.id ? 'text-emerald-400' : 'text-theme-primary'
                    }`}>
                      {reciter.name[language]}
                    </h3>
                    <p className="text-theme-muted text-sm mt-0.5">
                      {reciter.country[language]}
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

          {activeSection === 'translator' && (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {translators.filter(t => t.available).map((translator) => (
                <button
                  key={translator.id}
                  onClick={() => updateSettings({ translator: translator.id })}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.translator === translator.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    settings.translator === translator.id ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    <TranslationIcon />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`font-semibold text-base ${
                      settings.translator === translator.id ? 'text-emerald-400' : 'text-theme-primary'
                    }`}>
                      {translator.name}
                    </h3>
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

          {activeSection === 'arabicFont' && (
            <div className="space-y-2">
              {arabicFonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => updateSettings({ arabicFont: font.id })}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.arabicFont === font.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-arabic text-xl ${
                    settings.arabicFont === font.id ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    ا
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`font-semibold text-base ${
                      settings.arabicFont === font.id ? 'text-emerald-400' : 'text-theme-primary'
                    }`}>
                      {font.name[language]}
                    </h3>
                    <p className="text-theme-muted text-sm mt-0.5">
                      {font.description[language]}
                    </p>
                  </div>
                  {settings.arabicFont === font.id && (
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeSection === 'persianFont' && (
            <div className="space-y-2">
              {persianFonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => updateSettings({ persianFont: font.id })}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.persianFont === font.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-theme bg-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                    settings.persianFont === font.id ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-muted'
                  }`}>
                    ف
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`font-semibold text-base ${
                      settings.persianFont === font.id ? 'text-emerald-400' : 'text-theme-primary'
                    }`}>
                      {font.name[language]}
                    </h3>
                    <p className="text-theme-muted text-sm mt-0.5">
                      {font.description[language]}
                    </p>
                  </div>
                  {settings.persianFont === font.id && (
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SettingsItem({ icon, title, subtitle, onClick }: {
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-theme-hover transition-colors text-right"
    >
      <div className="text-emerald-400">{icon}</div>
      <div className="flex-1">
        <h3 className="text-theme-primary font-medium">{title}</h3>
        {subtitle && <p className="text-theme-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      {onClick && (
        <svg className="w-5 h-5 text-theme-muted rtl-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

function ToggleItem({ icon, title, checked, onChange }: {
  icon: JSX.Element;
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="text-emerald-400">{icon}</div>
      <div className="flex-1">
        <h3 className="text-theme-primary font-medium">{title}</h3>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-theme-tertiary'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? 'right-0.5' : 'right-6'
          }`}
        />
      </button>
    </div>
  );
}

function ThemeIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  );
}

function FontIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/>
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  );
}

function ReciterIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
    </svg>
  );
}

function TranslationIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  );
}

function ArabicFontIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.93 13.5h4.14L12 7.98 9.93 13.5zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/>
    </svg>
  );
}

function PersianFontIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 4v3h5.5v12h3V7H19V4z"/>
    </svg>
  );
}
