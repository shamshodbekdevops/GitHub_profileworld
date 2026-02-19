import { WorldData } from '@/lib/types';
import { Card } from '@/components/ui/card';

export function StatsPanel({ world }: { world: WorldData }) {
  const topLanguages = world.languages.slice(0, 3);

  return (
    <Card className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold">@{world.username}</h3>
        <p className="text-xs text-text300">Generated {new Date(world.generated_at).toLocaleString()}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-white/5 p-2">Repos: {world.totals.repo_count}</div>
        <div className="rounded-lg bg-white/5 p-2">Stars: {world.totals.total_stars}</div>
        <div className="rounded-lg bg-white/5 p-2">Followers: {world.followers}</div>
        <div className="rounded-lg bg-white/5 p-2">Following: {world.following}</div>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-text300">Top Languages</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {topLanguages.length ? (
            topLanguages.map((item) => (
              <span key={item.language} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1">
                {item.language} {item.percent}%
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
