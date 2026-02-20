import Link from 'next/link';

import { RepoSnapshot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function RepoDetailsPanel({ repo }: { repo?: RepoSnapshot }) {
  if (!repo) {
    return (
      <Card className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Select a building</h3>
          <p className="text-sm text-text300">Click any repository building to open full details.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-text300">
          <p className="mb-1 font-medium text-text100">What you are seeing</p>
          <p>Building height = repo activity</p>
          <p>Trees nearby = recent commits</p>
          <p>Glow particles = stars</p>
        </div>
        <p className="text-xs text-text300">Tip: if the map looks empty, switch filters to All or clear your search.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-gold">Repository Details</p>
        <h3 className="text-lg font-semibold">{repo.name}</h3>
        <p className="text-xs text-text300">{repo.full_name}</p>
      </div>
      <p className="text-sm text-text300">{repo.description || 'No description provided.'}</p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-text300">
        <p>
          This building represents <span className="text-text100">{repo.name}</span>. Higher block height means higher
          combined activity in this project.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-white/5 p-2">Stars: {repo.stars}</div>
        <div className="rounded-lg bg-white/5 p-2">Commits (30d): {repo.commits_30d}</div>
        <div className="rounded-lg bg-white/5 p-2">Forks: {repo.forks}</div>
        <div className="rounded-lg bg-white/5 p-2">Issues: {repo.open_issues}</div>
      </div>
      <Link href={repo.html_url} target="_blank">
        <Button variant="secondary" className="w-full">
          Open on GitHub
        </Button>
      </Link>
    </Card>
  );
}
