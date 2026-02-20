'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getShareWorld } from '@/lib/api';

function downloadPoster(username: string, totals: { repo_count: number; total_stars: number; total_forks: number; total_watchers: number }) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0E131F" />
      <stop offset="50%" stop-color="#181F31" />
      <stop offset="100%" stop-color="#10181D" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <text x="72" y="106" fill="#F2C46D" font-size="26" font-family="Manrope">GitHub Profile World</text>
  <text x="72" y="190" fill="#F4F1EA" font-size="64" font-weight="700" font-family="Space Grotesk">@${username}</text>
  <text x="72" y="246" fill="#B7B0A2" font-size="24" font-family="Manrope">Recruiter-ready public profile snapshot</text>
  <text x="72" y="340" fill="#F4F1EA" font-size="32" font-family="JetBrains Mono">Repos: ${totals.repo_count}</text>
  <text x="72" y="390" fill="#F4F1EA" font-size="32" font-family="JetBrains Mono">Stars: ${totals.total_stars}</text>
  <text x="72" y="440" fill="#F4F1EA" font-size="32" font-family="JetBrains Mono">Forks: ${totals.total_forks}</text>
  <text x="72" y="490" fill="#F4F1EA" font-size="32" font-family="JetBrains Mono">Watchers: ${totals.total_watchers}</text>
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

  const topRepos = useMemo(
    () => data?.repos.slice().sort((a, b) => b.stars - a.stars).slice(0, 6) ?? [],
    [data],
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-6 py-10">
        <Skeleton className="h-28 w-full" />
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
          <Link href="/generate" className="mt-4 inline-block text-mint">
            Generate a new world
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-6 py-10">
      <Card className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-gold">Public Profile World</p>
        <h1 className="text-3xl font-bold">@{data.username}&apos;s GitHub World Snapshot</h1>
        <p className="max-w-3xl text-sm text-text300">
          This is a read-only world view optimized for portfolio reviews and recruiter screening.
        </p>
      </Card>

      <Card className="p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">Repos: {data.totals.repo_count}</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">Stars: {data.totals.total_stars}</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">Followers: {data.followers}</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">Following: {data.following}</div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 text-xl font-semibold">Top Repositories by Stars</h2>
        <div className="space-y-2">
          {topRepos.length ? (
            topRepos.map((repo) => (
              <div key={repo.repo_id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span>{repo.name}</span>
                <span className="text-sm text-text300">{repo.stars} stars</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-text300">No repositories available in this shared world.</p>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={copyLink}>{copied ? 'Copied' : 'Copy Link'}</Button>
        <Button variant="secondary" onClick={() => downloadPoster(data.username, data.totals)}>
          Download Poster
        </Button>
        <Link href={`/world/${data.id}`}>
          <Button variant="ghost">Open Full Interactive View</Button>
        </Link>
      </div>
    </main>
  );
}

