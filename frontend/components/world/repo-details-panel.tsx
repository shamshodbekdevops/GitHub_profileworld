import Link from 'next/link';

import { RepoSnapshot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function RepoDetailsPanel({ repo }: { repo?: RepoSnapshot }) {
  if (!repo) {
    return (
      <Card className="space-y-4 border-white/8">
        <div>
          <h3 className="text-lg font-bold text-text100">Select a building</h3>
          <p className="text-sm text-text300 mt-1">Click any repository building to open full details.</p>
        </div>
        <div className="rounded-2xl border border-mint/15 bg-mint/5 px-4 py-4 text-sm text-text300 space-y-2">
          <p className="font-bold text-text100 text-sm mb-2">Legend</p>
          <div className="flex items-center gap-2"><span className="text-mint text-base">🏗️</span> Building height = repo activity</div>
          <div className="flex items-center gap-2"><span className="text-moss text-base">🌿</span> Trees = recent commits</div>
          <div className="flex items-center gap-2"><span className="text-gold text-base">✨</span> Glow particles = stars</div>
        </div>
        <p className="text-xs text-text300/70">Tip: if the map looks empty, switch filters to All or clear your search.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-5 border-mint/12 shadow-glow">
      <div className="pb-3 border-b border-white/8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-1">Repository Details</p>
        <h3 className="text-xl font-extrabold text-text100 tracking-tight">{repo.name}</h3>
        <p className="text-xs text-mint font-mono-tech mt-1">{repo.full_name}</p>
      </div>
      <p className="text-sm text-text300 leading-relaxed">{repo.description || 'No description provided.'}</p>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: 'Stars', value: repo.stars, icon: '⭐' },
          { label: 'Commits (30d)', value: repo.commits_30d, icon: '📝' },
          { label: 'Forks', value: repo.forks, icon: '🍴' },
          { label: 'Open Issues', value: repo.open_issues, icon: '🐛' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/4 px-3 py-3 hover:border-mint/25 transition-colors">
            <div className="text-base mb-1">{stat.icon}</div>
            <div className="text-lg font-extrabold text-text100 font-mono-tech">{stat.value}</div>
            <div className="text-xs text-text300">{stat.label}</div>
          </div>
        ))}
      </div>

      <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" className="w-full border-gold/30 hover:bg-gold/15 text-gold">
          Open on GitHub ↗
        </Button>
      </Link>
    </Card>
  );
}

