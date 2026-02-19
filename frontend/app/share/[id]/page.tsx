'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getShareWorld } from '@/lib/api';

function downloadPoster(username: string, totals: { repo_count: number; total_stars: number; total_forks: number; total_watchers: number }) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#070B14" />
      <stop offset="50%" stop-color="#0D1322" />
      <stop offset="100%" stop-color="#071827" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <text x="72" y="120" fill="#3EE7FF" font-size="28" font-family="Manrope">GitHub Profile World</text>
  <text x="72" y="205" fill="#EAF2FF" font-size="64" font-weight="700" font-family="Space Grotesk">@${username}</text>
  <text x="72" y="270" fill="#A9B7D4" font-size="28" font-family="Manrope">Portfolio Snapshot</text>
  <text x="72" y="370" fill="#EAF2FF" font-size="34" font-family="JetBrains Mono">Repos: ${totals.repo_count}</text>
  <text x="72" y="420" fill="#EAF2FF" font-size="34" font-family="JetBrains Mono">Stars: ${totals.total_stars}</text>
  <text x="72" y="470" fill="#EAF2FF" font-size="34" font-family="JetBrains Mono">Forks: ${totals.total_forks}</text>
  <text x="72" y="520" fill="#EAF2FF" font-size="34" font-family="JetBrains Mono">Watchers: ${totals.total_watchers}</text>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${username}-github-profile-world.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['share-world', id],
    queryFn: () => getShareWorld(id),
  });

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-6 py-10">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-72 w-full" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6">
        <Card className="w-full p-6">
          <h1 className="mb-2 text-2xl font-bold">Share link unavailable</h1>
          <p className="text-sm text-danger">{(error as Error)?.message || 'Link expired or disabled'}</p>
          <Link href="/generate" className="mt-4 inline-block text-cyan">
            Generate a new world
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-6 py-10">
      <Card className="p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-cyan">Public World</p>
        <h1 className="text-3xl font-bold">@{data.username}&apos;s GitHub Profile World</h1>
        <p className="mt-2 text-sm text-text300">Read-only recruiter view with project highlights and activity signals.</p>
      </Card>

      <Card className="p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white/5 p-3">Repos: {data.totals.repo_count}</div>
          <div className="rounded-xl bg-white/5 p-3">Stars: {data.totals.total_stars}</div>
          <div className="rounded-xl bg-white/5 p-3">Followers: {data.followers}</div>
          <div className="rounded-xl bg-white/5 p-3">Following: {data.following}</div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 text-xl font-semibold">Top repositories</h2>
        <div className="space-y-2">
          {data.repos.slice(0, 6).map((repo) => (
            <div key={repo.repo_id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span>{repo.name}</span>
              <span className="text-sm text-text300">{repo.stars} stars</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={copyLink}>{copied ? 'Copied' : 'Copy Link'}</Button>
        <Button variant="secondary" onClick={() => downloadPoster(data.username, data.totals)}>
          Download Poster
        </Button>
        <Link href={`/world/${data.id}`}>
          <Button variant="ghost">Open Full World</Button>
        </Link>
      </div>
    </main>
  );
}
