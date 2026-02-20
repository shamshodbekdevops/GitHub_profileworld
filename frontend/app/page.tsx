import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroPreview } from '@/components/world/hero-preview';

const mappingItems = [
  { label: 'Repository', value: 'Building / city block' },
  { label: 'Commits', value: 'Tree density around each building' },
  { label: 'Stars', value: 'Glow energy particles' },
  { label: 'Languages', value: 'District color theme' },
  { label: 'Followers', value: 'City population activity' },
];

const quickFlow = [
  {
    title: 'Paste GitHub profile',
    body: 'Enter a username or profile URL. No setup, no manual mapping.',
  },
  {
    title: 'Generate 3D world',
    body: 'We transform repositories and activity into a clean interactive city.',
  },
  {
    title: 'Share with recruiters',
    body: 'Send a read-only link that communicates impact faster than raw charts.',
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-8 md:px-10">
      <header className="flex items-center justify-between">
        <div className="text-lg font-bold tracking-wide">GitHub Profile World</div>
        <nav className="hidden items-center gap-6 text-sm text-text300 md:flex">
          <a href="#mapping" className="hover:text-text100">
            Mapping
          </a>
          <a href="#flow" className="hover:text-text100">
            How it works
          </a>
          <Link href="/generate" className="hover:text-text100">
            Generate
          </Link>
        </nav>
      </header>

      <section className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div className="space-y-6 fade-in">
          <p className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Premium GitHub portfolio experience
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Turn GitHub activity into a world recruiters can understand in seconds.
          </h1>
          <p className="max-w-2xl text-base text-text300 md:text-lg">
            GitHub Profile World converts repositories, commits, stars, and languages into a smooth 3D city. It feels modern
            and game-like, while staying professional for hiring conversations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/generate">
              <Button>Generate My World</Button>
            </Link>
            <Link href="/generate?sample=torvalds">
              <Button variant="secondary">Try sample user</Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-text300">
            <span className="rounded-full border border-white/15 px-3 py-1">Fast first load</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Share-ready links</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Recruiter friendly</span>
          </div>
        </div>

        <HeroPreview />
      </section>

      <section id="mapping" className="stagger-in">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-gold">Visual Mapping</p>
              <h2 className="text-2xl font-semibold">What each part of the world means</h2>
            </div>
            <p className="max-w-md text-sm text-text300">No hidden logic. Every shape and color maps directly to GitHub metrics.</p>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {mappingItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-text300">{item.label}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="flow" className="grid gap-4 md:grid-cols-3">
        {quickFlow.map((item) => (
          <Card key={item.title} className="hover-lift p-5">
            <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-text300">{item.body}</p>
          </Card>
        ))}
      </section>

      <section>
        <Card className="p-6">
          <p className="mb-4 text-sm uppercase tracking-[0.16em] text-text300">Built for recruiter conversations</p>
          <div className="grid gap-3 text-sm text-text300 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 font-medium text-text100">Clear story</p>
              <p>Shows project impact visually instead of raw lists and tables.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 font-medium text-text100">Fast scan</p>
              <p>Hiring teams can identify top repositories and activity patterns quickly.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 font-medium text-text100">Share ready</p>
              <p>Public view mode makes it easy to send in CVs, portfolios, and job applications.</p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

