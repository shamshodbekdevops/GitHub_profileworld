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

      <section className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center min-h-[80vh]">
        <div className="space-y-8 fade-in">
          <p className="inline-flex rounded-full border border-mint/40 bg-mint/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-mint shadow-glow">
            Premium Developer Portfolio
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl bg-gradient-to-r from-white via-text100 to-text300 bg-clip-text text-transparent">
            Turn your GitHub into a living world.
          </h1>
          <p className="max-w-2xl text-lg text-text300 md:text-xl leading-relaxed">
            Transform your repositories, commits, and activity into an interactive, futuristic 3D city. 
            Showcase your developer journey in a way that stands out and gets noticed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/generate" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto text-lg px-8 py-4 bg-mint text-bg900 hover:bg-white transition-colors shadow-glow-strong">
                Generate My World
              </Button>
            </Link>
            <Link href="/generate?sample=torvalds" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full sm:w-auto text-lg px-8 py-4 border-white/20 hover:bg-white/5">
                View Live Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-text300 pt-4 font-mono-tech">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              <span>Real-time data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Highly shareable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span>3D Interactive</span>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-mint/20 to-accent/20 rounded-full blur-3xl opacity-50 animate-pulse" />
          <HeroPreview />
        </div>
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

