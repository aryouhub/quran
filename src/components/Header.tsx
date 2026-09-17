import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenNavigation: () => void;
  onToggleImmersive: () => void;
  immersiveMode: boolean;
}

export function Header({ 
  onToggleSidebar, 
  onOpenSettings, 
  onOpenNavigation,
  onToggleImmersive, 
  immersiveMode 
}: HeaderProps) {
  const { t, language } = useLanguage();

  return (
    <header className="h-14 bg-theme-primary/95 backdrop-blur-md border-b border-theme/50 flex items-center justify-between px-3 sm:px-4 relative z-40">
      {/* Right side - Hamburger menu */}
      <button
        onClick={onToggleSidebar}
        className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Center - Title */}
      <h1 className="text-theme-primary font-bold text-base sm:text-lg absolute left-1/2 -translate-x-1/2 pointer-events-none">
        {t.siteTitle}
      </h1>

      {/* Left side - Action buttons */}
      <div className="flex items-center gap-1">
        {/* Navigation button */}
        <button
          onClick={onOpenNavigation}
          className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
          title={language === 'fa' ? 'ناوبری' : language === 'ar' ? 'التنقل' : 'Navigation'}
          aria-label="Navigation"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </button>

        {/* Immersive Mode Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleImmersive();
          }}
          className={`p-2 rounded-lg transition-colors ${
            immersiveMode 
              ? 'text-emerald-400 bg-emerald-500/10' 
              : 'text-theme-muted hover:text-theme-primary hover:bg-theme-hover'
          }`}
          title={language === 'fa' ? 'حالت مطالعه' : language === 'ar' ? 'وضع القراءة' : 'Reading Mode'}
          aria-label="Reading Mode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" className="block">
            <path d="M0 0h512v512H0z" fill="none" />
            <path fill="currentColor" fillRule="evenodd" d="M331.52 117.547c0 41.386-33.707 74.88-74.88 74.88c-41.387 0-74.88-33.494-74.88-74.88c0-41.387 33.493-74.88 74.88-74.88s74.88 33.493 74.88 74.88m-96.853 125.748L64 157.867v215.04l170.667 85.428zm42.666 215.681l171.947-86.069v-215.04l-171.947 86.069z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
          title={t.settings}
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="18" x="2" y="3" strokeLinecap="round" strokeLinejoin="round" rx="2" />
              <path d="M22 9H2" />
            </g>
          </svg>
        </button>
      </div>
    </header>
  );
}
