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
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3 border border-white/8 shadow-glow">
      <div className="mr-2 text-xs font-bold uppercase tracking-[0.2em] text-mint">Filters</div>
      <button
        className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${languageFilter === 'All' ? 'bg-mint text-bg900 shadow-glow' : 'bg-white/8 text-text300 hover:bg-white/15 hover:text-text100 border border-white/10'}`}
        onClick={() => setLanguageFilter('All')}
      >
        All
      </button>
      {languages.slice(0, 8).map((lang) => (
        <button
          key={lang.language}
          className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${languageFilter === lang.language ? 'bg-mint text-bg900 shadow-glow' : 'bg-white/8 text-text300 hover:bg-white/15 hover:text-text100 border border-white/10'}`}
          onClick={() => setLanguageFilter(lang.language)}
        >
          {lang.language}
        </button>
      ))}

      <select
        className="ml-auto rounded-xl border border-white/12 bg-bg700/90 px-4 py-1.5 text-sm text-text100 outline-none focus:border-mint/40"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'stars' | 'activity' | 'name')}
      >
        <option value="activity">Activity</option>
        <option value="stars">Stars</option>
        <option value="name">Name</option>
      </select>

      <label className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-1.5 text-sm text-text300 cursor-pointer hover:bg-white/10 transition-colors">
        <input type="checkbox" checked={forestMode} onChange={(e) => setForestMode(e.target.checked)} className="accent-mint" />
        Trees = commits
      </label>

      <label className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-1.5 text-sm text-text300 cursor-pointer hover:bg-white/10 transition-colors">
        <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} className="accent-mint" />
        Reduced motion
      </label>
    </div>
  );
}
