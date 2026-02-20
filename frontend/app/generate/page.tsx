'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateWorld } from '@/lib/api';

function parseInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, reason: 'Please enter a username or GitHub URL.' };
  }
  if (trimmed.includes('github.com')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const parts = url.pathname.split('/').filter(Boolean);
      if (!parts.length) {
        return { valid: false, reason: 'GitHub URL must include a username.' };
      }
      return { valid: true, payload: { github_url: `https://github.com/${parts[0]}` } };
    } catch {
      return { valid: false, reason: 'Invalid URL format.' };
    }
  }
  return { valid: true, payload: { username: trimmed.replace('@', '') } };
}

function friendlyError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('rate limit')) {
    return 'GitHub API rate limit reached. Add GITHUB_TOKEN in backend/.env and try again in a few minutes.';
  }
  if (normalized.includes('not found')) {
    return 'GitHub profile not found. Check the username and try again.';
  }
  if (normalized.includes('private')) {
    return 'This profile has limited public data. Try another profile.';
  }
  return message;
}

const explainers = [
  'Repo size and activity become building scale.',
  'Commits in the last 30 days become trees.',
  'Stars become glowing energy particles.',
  'Language mix drives district colors.',
];

function GeneratePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sample = searchParams.get('sample') || '';
  const [input, setInput] = useState(sample);
  const [error, setError] = useState('');

  const validation = useMemo(() => parseInput(input), [input]);

  const mutation = useMutation({
    mutationFn: generateWorld,
    onSuccess: (data) => {
      router.push(`/world/${data.world_id}`);
    },
    onError: (err: Error) => {
      setError(friendlyError(err.message));
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validation.valid || !validation.payload) {
      setError(validation.reason || 'Invalid input');
      return;
    }
    mutation.mutate(validation.payload);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-6 pb-12 pt-10">
      <Link href="/" className="w-fit text-sm text-text300 hover:text-text100">
        Back to landing
      </Link>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6 p-6 md:p-8">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-gold">Generator</p>
            <h1 className="mb-2 text-3xl font-bold">Generate your GitHub World</h1>
            <p className="text-sm text-text300">
              Paste a GitHub profile URL or username. We will fetch public data and build your interactive world city.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-text300" htmlFor="githubInput">
              GitHub URL or username
            </label>
            <Input
              id="githubInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. torvalds or https://github.com/gaearon"
            />
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-text300">
              Accepted formats: <span className="font-mono-tech">torvalds</span>, <span className="font-mono-tech">@gaearon</span>,{' '}
              <span className="font-mono-tech">github.com/vercel</span>
            </div>

            {error ? (
              <div className="rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Generating world...' : 'Generate World'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setInput('torvalds')}>
                Try sample user
              </Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-gold">What Happens</p>
            <h2 className="text-xl font-semibold">How your data is visualized</h2>
          </div>
          <div className="space-y-2 text-sm text-text300">
            {explainers.map((item) => (
              <p key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                {item}
              </p>
            ))}
          </div>
          <p className="text-xs text-text300">
            Tip: add <span className="font-mono-tech">GITHUB_TOKEN</span> in backend <span className="font-mono-tech">.env</span> for
            higher API limits.
          </p>
        </Card>
      </section>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-6 pb-12 pt-10">
          <div className="h-5 w-36 rounded bg-white/10" />
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="space-y-3 p-6 md:p-8">
              <div className="h-8 w-72 rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-12 w-full rounded bg-white/10" />
            </Card>
            <Card className="space-y-2 p-6">
              <div className="h-6 w-32 rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
            </Card>
          </div>
        </main>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
