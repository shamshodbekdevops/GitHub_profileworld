'use client';

import { LanguageStat } from '@/lib/types';
import { useWorldUiStore } from '@/store/world-store';

interface FilterBarProps {
  languages: LanguageStat[];
}

export function FilterBar({ languages }: FilterBarProps) {
  const { languageFilter, setLanguageFilter, sortBy, setSortBy, forestMode, setForestMode, reducedMotion, setReducedMotion } =
    useWorldUiStore();

  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3">
      <div className="mr-2 text-xs uppercase tracking-[0.14em] text-text300">Filters</div>
      <button
        className={`rounded-lg px-3 py-1.5 text-sm ${languageFilter === 'All' ? 'bg-mint text-bg900' : 'bg-white/10 text-text100'}`}
        onClick={() => setLanguageFilter('All')}
      >
        All
      </button>
      {languages.slice(0, 8).map((lang) => (
        <button
          key={lang.language}
          className={`rounded-lg px-3 py-1.5 text-sm ${languageFilter === lang.language ? 'bg-mint text-bg900' : 'bg-white/10 text-text100'}`}
          onClick={() => setLanguageFilter(lang.language)}
        >
          {lang.language}
        </button>
      ))}

      <select
        className="ml-auto rounded-lg border border-white/15 bg-bg800/80 px-3 py-1.5 text-sm"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'stars' | 'activity' | 'name')}
      >
        <option value="activity">Sort: Activity</option>
        <option value="stars">Sort: Stars</option>
        <option value="name">Sort: Name</option>
      </select>

      <label className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 text-sm">
        <input type="checkbox" checked={forestMode} onChange={(e) => setForestMode(e.target.checked)} />
        Forest density
      </label>

      <label className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 text-sm">
        <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
        Reduced motion
      </label>
    </div>
  );
}
