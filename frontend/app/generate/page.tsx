'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';

import { generateWorld } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
      setError(err.message);
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
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 pb-12 pt-10">
      <Link href="/" className="mb-8 text-sm text-text300 hover:text-text100">
        Back to landing
      </Link>
      <Card className="p-6 md:p-8">
        <h1 className="mb-2 text-3xl font-bold">Generate your GitHub World</h1>
        <p className="mb-6 text-sm text-text300">Enter a GitHub username or profile URL to build your interactive city.</p>

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
          <div className="text-xs text-text300">
            Accepted formats: <span className="font-mono-tech">torvalds</span>,{' '}
            <span className="font-mono-tech">@gaearon</span>,{' '}
            <span className="font-mono-tech">github.com/vercel</span>
          </div>

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Generating...' : 'Generate World'}
            </Button>
            <button
              type="button"
              onClick={() => setInput('torvalds')}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-text100 hover:bg-white/10"
            >
              Try sample user
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 pb-12 pt-10">
          <div className="mb-8 h-5 w-36 rounded bg-white/10" />
          <Card className="space-y-3 p-6 md:p-8">
            <div className="h-8 w-72 rounded bg-white/10" />
            <div className="h-4 w-96 rounded bg-white/10" />
            <div className="h-12 w-full rounded bg-white/10" />
          </Card>
        </main>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
