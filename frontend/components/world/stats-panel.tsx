import { WorldData } from '@/lib/types';
import { Card } from '@/components/ui/card';

export function StatsPanel({ world }: { world: WorldData }) {
  const topLanguages = world.languages.slice(0, 4);

  return (
    <Card className="space-y-5 border-mint/10 shadow-glow">
      <div className="space-y-1 pb-2 border-b border-white/8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Profile Snapshot</p>
        <h3 className="text-xl font-extrabold tracking-tight text-text100">@{world.username}</h3>
        <p className="text-xs text-text300">Generated {new Date(world.generated_at).toLocaleString()}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: 'Repos', value: world.totals.repo_count, icon: '🏗️' },
          { label: 'Stars', value: world.totals.total_stars, icon: '⭐' },
          { label: 'Followers', value: world.followers, icon: '👥' },
          { label: 'Following', value: world.following, icon: '➡️' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 hover:border-mint/25 transition-colors">
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className="text-xl font-extrabold text-text100 font-mono-tech">{stat.value}</div>
            <div className="text-xs text-text300">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-text300">Top Languages</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {topLanguages.length ? (
            topLanguages.map((item) => (
              <span key={item.language} className="rounded-full border border-mint/25 bg-mint/8 px-3 py-1.5 text-mint font-semibold">
                {item.language} <span className="opacity-70">{item.percent}%</span>
              </span>
            ))
          ) : (
            <span className="text-text300">No language data</span>
          )}
        </div>
      </div>
    </Card>
  );
}

