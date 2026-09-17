import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export function Header({ onToggleSidebar, onOpenSettings }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="h-14 bg-theme-primary/95 backdrop-blur-md border-b border-theme/50 flex items-center justify-between px-3 sm:px-4">
      <button
        onClick={onToggleSidebar}
        className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-theme-primary font-bold text-base sm:text-lg absolute left-1/2 -translate-x-1/2">
        {t.siteTitle}
      </h1>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenSettings}
          className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
          title={t.settings}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
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
