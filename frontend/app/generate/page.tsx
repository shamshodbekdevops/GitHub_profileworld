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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-10">
      <Link href="/" className="w-fit flex items-center gap-2 text-sm text-text300 hover:text-mint transition-colors group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to home
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-8 p-8 md:p-10 border-white/8">
          <div className="space-y-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-mint">Generator</p>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-white to-text300 bg-clip-text text-transparent">
              Generate Your GitHub World
            </h1>
            <p className="text-text300 leading-relaxed">
              Paste a GitHub profile URL or username. We fetch your public data and build an interactive 3D city.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text100" htmlFor="githubInput">
                GitHub URL or username
              </label>
              <Input
                id="githubInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. torvalds or https://github.com/gaearon"
                className="text-base"
              />
              <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-xs text-text300">
                Accepted: <span className="font-mono-tech text-mint">torvalds</span>, <span className="font-mono-tech text-mint">@gaearon</span>,{' '}
                <span className="font-mono-tech text-mint">github.com/vercel</span>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending} className="px-8 py-3 bg-mint text-bg900 hover:bg-white transition-colors shadow-glow text-base font-bold">
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-bg900/30 border-t-bg900 rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : 'Generate World'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setInput('torvalds')} className="border-white/15 hover:border-mint/30">
                Try sample
              </Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-6 p-7 border-white/8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2">Visual Map</p>
            <h2 className="text-xl font-bold text-text100">How your data becomes a world</h2>
          </div>
          <div className="space-y-3">
            {explainers.map((item, i) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3 hover:border-mint/20 transition-colors">
                <span className="text-mint font-mono-tech font-bold text-sm mt-0.5">0{i + 1}</span>
                <p className="text-sm text-text300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-gold/20 bg-gold/8 px-4 py-3 text-xs text-gold/90">
            💡 Tip: Add <span className="font-mono-tech font-bold">GITHUB_TOKEN</span> in backend <span className="font-mono-tech">.env</span> for higher API rate limits.
          </div>
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
