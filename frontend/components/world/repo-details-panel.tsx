import Link from 'next/link';

import { RepoSnapshot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function RepoDetailsPanel({ repo }: { repo?: RepoSnapshot }) {
  if (!repo) {
    return (
      <Card>
        <h3 className="mb-2 text-lg font-semibold">Select a building</h3>
        <p className="text-sm text-text300">Click any repo building in the city to inspect details.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{repo.name}</h3>
        <p className="text-xs text-text300">{repo.full_name}</p>
      </div>
      <p className="text-sm text-text300">{repo.description || 'No description provided.'}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-white/5 p-2">Stars: {repo.stars}</div>
        <div className="rounded-lg bg-white/5 p-2">Commits (30d): {repo.commits_30d}</div>
        <div className="rounded-lg bg-white/5 p-2">Forks: {repo.forks}</div>
        <div className="rounded-lg bg-white/5 p-2">Issues: {repo.open_issues}</div>
      </div>
      <Link href={repo.html_url} target="_blank">
        <Button variant="secondary" className="w-full">
          Open Repository
        </Button>
      </Link>
    </Card>
  );
}
