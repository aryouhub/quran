import { useState, useMemo } from 'react';
import { surahs, Surah, getSurahName } from '../data/surahs';
import { useLanguage } from '../context/LanguageContext';
import { toPersianNumber } from '../utils/persianNumber';

interface SidebarProps {
  selectedSurah: Surah | null;
  onSelectSurah: (surah: Surah) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ selectedSurah, onSelectSurah, isOpen, onClose }: SidebarProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan'>('all');

  const filteredSurahs = useMemo(() => {
    return surahs.filter(surah => {
      const localizedName = getSurahName(surah, language);
      const matchesSearch = surah.name.includes(searchTerm) ||
        surah.persianName.includes(searchTerm) ||
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        localizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString() === searchTerm;
      const matchesFilter = filter === 'all' ||
        (filter === 'meccan' && surah.revelationType === 'Meccan') ||
        (filter === 'medinan' && surah.revelationType === 'Medinan');
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter, language]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-0 bg-theme-primary z-50 transform transition-transform duration-300 overflow-hidden flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="md:hidden p-4 border-b border-theme sticky top-0 bg-theme-primary z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-theme-primary text-lg font-bold">
              {t.surahs}
            </h2>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-primary p-2 rounded-lg hover:bg-theme-hover transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={t.searchSurah}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-theme-secondary text-theme-primary rounded-lg px-4 py-2.5 pr-10
                           border border-theme focus:border-emerald-500 focus:outline-none
                           placeholder-theme-dim text-sm"
              />
              <svg className="absolute right-3 top-3 w-4 h-4 text-theme-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setFilter('meccan')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'meccan' ? 'bg-emerald-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                }`}
              >
                {t.meccan}
              </button>
              <button
                onClick={() => setFilter('medinan')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'medinan' ? 'bg-emerald-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                }`}
              >
                {t.medinan}
              </button>
            </div>
          </div>

          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => {
                onSelectSurah(surah);
                onClose();
              }}
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
      </aside>
    </>
  );
}
