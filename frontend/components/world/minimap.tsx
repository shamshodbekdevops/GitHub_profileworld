import { RepoSnapshot } from '@/lib/types';

interface MinimapProps {
  repos: RepoSnapshot[];
  selectedRepoId: number | null;
  onSelectRepo: (repoId: number) => void;
}

export function Minimap({ repos, selectedRepoId, onSelectRepo }: MinimapProps) {
  const maxAbs = repos.reduce((acc, repo) => Math.max(acc, Math.abs(repo.pos_x), Math.abs(repo.pos_z)), 1);

  return (
    <div className="glass rounded-2xl p-3">
      <div className="mb-2 text-xs uppercase tracking-[0.14em] text-text300">Minimap</div>
      <div className="relative h-44 rounded-xl border border-white/10 bg-bg900/70">
        {repos.map((repo) => {
          const x = 50 + (repo.pos_x / maxAbs) * 44;
          const y = 50 + (repo.pos_z / maxAbs) * 44;
          const active = repo.repo_id === selectedRepoId;
          return (
            <button
              key={repo.repo_id}
              onClick={() => onSelectRepo(repo.repo_id)}
              className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${active ? 'bg-cyan shadow-[0_0_10px_#3EE7FF]' : 'bg-text300/70'}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`Focus ${repo.name}`}
            />
          );
        })}
      </div>
    </div>
  );
}
