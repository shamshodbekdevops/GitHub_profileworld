import { Card } from '@/components/ui/card';

interface WorldGuideCardProps {
  totalRepos: number;
  visibleRepos: number;
}

function LegendItem({ color, title, description }: { color: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${color}`} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-text300">{description}</p>
      </div>
    </div>
  );
}

export function WorldGuideCard({ totalRepos, visibleRepos }: WorldGuideCardProps) {
  return (
    <Card className="space-y-4 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-gold">Quick Guide</p>
        <h2 className="text-lg font-semibold">How to read this world</h2>
        <p className="text-sm text-text300">
          You are seeing <span className="font-semibold text-text100">{visibleRepos}</span> of{' '}
          <span className="font-semibold text-text100">{totalRepos}</span> repositories after filters/search.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <LegendItem color="bg-mint" title="Building height" description="Repository activity score (higher = more active)." />
        <LegendItem color="bg-moss" title="Trees" description="Commit intensity in the last 30 days." />
        <LegendItem color="bg-gold" title="Glow particles" description="Star power of repositories." />
        <LegendItem color="bg-clay" title="District color" description="Primary programming language." />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
        <p className="font-medium">How to explore</p>
        <p className="text-text300">1. Drag to rotate. 2. Scroll to zoom. 3. Click any building to see repo details.</p>
      </div>
    </Card>
  );
}

