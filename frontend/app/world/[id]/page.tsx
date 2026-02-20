'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Minimap } from '@/components/world/minimap';
import { FilterBar } from '@/components/world/filter-bar';
import { RepoDetailsPanel } from '@/components/world/repo-details-panel';
import { StatsPanel } from '@/components/world/stats-panel';
import { WorldGuideCard } from '@/components/world/world-guide-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getWorld } from '@/lib/api';
import { RepoSnapshot } from '@/lib/types';
import { useWorldUiStore } from '@/store/world-store';

const WorldCanvas = dynamic(() => import('@/components/world/world-canvas').then((m) => m.WorldCanvas), { ssr: false });

function sortRepos(repos: RepoSnapshot[], sortBy: 'stars' | 'activity' | 'name') {
  const cloned = [...repos];
  if (sortBy === 'stars') {
    return cloned.sort((a, b) => b.stars - a.stars);
  }
  if (sortBy === 'name') {
    return cloned.sort((a, b) => a.name.localeCompare(b.name));
  }
  return cloned.sort((a, b) => b.activity_score - a.activity_score);
}

export default function WorldPage() {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');

  const {
    selectedRepoId,
    setSelectedRepoId,
    languageFilter,
    setLanguageFilter,
    sortBy,
    forestMode,
    reducedMotion,
  } = useWorldUiStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['world', id],
    queryFn: () => getWorld(id),
  });

  const filteredRepos = useMemo(() => {
    if (!data) {
      return [];
    }
    const byLanguage =
      languageFilter === 'All' ? data.repos : data.repos.filter((repo) => repo.primary_language === languageFilter);
    const bySearch = search.trim()
      ? byLanguage.filter((repo) => repo.name.toLowerCase().includes(search.trim().toLowerCase()))
      : byLanguage;
    return sortRepos(bySearch, sortBy);
  }, [data, languageFilter, sortBy, search]);

  const selectedRepo =
    filteredRepos.find((repo) => repo.repo_id === selectedRepoId) ||
    data?.repos.find((repo) => repo.repo_id === selectedRepoId);

  useEffect(() => {
    if (!filteredRepos.length) {
      if (selectedRepoId !== null) {
        setSelectedRepoId(null);
      }
      return;
    }
    const hasSelected = filteredRepos.some((repo) => repo.repo_id === selectedRepoId);
    if (!hasSelected) {
      setSelectedRepoId(filteredRepos[0].repo_id);
    }
  }, [filteredRepos, selectedRepoId, setSelectedRepoId]);

  const onSelectRepo = (repo: RepoSnapshot) => {
    setSelectedRepoId(repo.repo_id);
  };

  const clearFilters = () => {
    setLanguageFilter('All');
    setSearch('');
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-6 md:px-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[70vh] w-full" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6">
        <Card className="w-full p-6">
          <h1 className="mb-2 text-2xl font-bold">Unable to load world</h1>
          <p className="text-sm text-danger">{(error as Error)?.message || 'Unknown error'}</p>
          <Link href="/generate" className="mt-4 inline-block text-mint">
            Generate another world
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-4 px-4 py-5 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">{data.username}&apos;s Profile World</h1>
          <p className="text-sm text-text300">
            Interactive 3D portfolio map. Each building represents a repository with activity and popularity signals.
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/15 bg-bg800/75 px-3 py-2 text-sm"
            placeholder="Search repository name"
          />
          <Link href={`/share/${data.id}`}>
            <Button variant="secondary">Share Profile</Button>
          </Link>
        </div>
      </div>

      <FilterBar languages={data.languages} />
      <WorldGuideCard totalRepos={data.repos.length} visibleRepos={filteredRepos.length} />

      <div className="flex flex-wrap items-center gap-2 text-xs text-text300">
        <span>
          Showing <span className="font-semibold text-text100">{filteredRepos.length}</span> /{' '}
          <span className="font-semibold text-text100">{data.repos.length}</span> repos
        </span>
        {(languageFilter !== 'All' || search.trim()) && (
          <button onClick={clearFilters} className="rounded-lg border border-white/15 px-2 py-1 text-text100 hover:bg-white/10">
            Clear filters
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <StatsPanel world={data} />
          <Minimap repos={filteredRepos} selectedRepoId={selectedRepoId} onSelectRepo={setSelectedRepoId} />
        </div>

        <div className="order-1 lg:order-2">
          {filteredRepos.length ? (
            <WorldCanvas
              repos={filteredRepos}
              selectedRepoId={selectedRepoId}
              onSelectRepo={onSelectRepo}
              forestMode={forestMode}
              reducedMotion={reducedMotion}
            />
          ) : (
            <Card className="flex h-[60vh] min-h-[420px] items-center justify-center p-6 text-center md:h-[74vh]">
              <div className="max-w-sm space-y-3">
                <h3 className="text-xl font-semibold">No repositories visible</h3>
                <p className="text-sm text-text300">
                  Current filters or search removed all results. Reset filters to view your full world.
                </p>
                <Button onClick={clearFilters}>Show all repositories</Button>
              </div>
            </Card>
          )}
        </div>

        <div className="order-3">
          <RepoDetailsPanel repo={selectedRepo} />
        </div>
      </div>
    </main>
  );
}
