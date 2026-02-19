import { WorldData } from '@/lib/types';
import { Card } from '@/components/ui/card';

export function StatsPanel({ world }: { world: WorldData }) {
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
    </Card>
  );
}
