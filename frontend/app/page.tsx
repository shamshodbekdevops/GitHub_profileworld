import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroPreview } from '@/components/world/hero-preview';

const features = [
  {
    icon: '🏙️',
    title: 'Repos as Buildings',
    desc: 'Each repository becomes a unique 3D building. Size, stars, and activity define its shape and glow.',
  },
  {
    icon: '✨',
    title: 'Stars as Particles',
    desc: 'Stargazers are visualized as glowing energy particles that orbit around popular repositories.',
  },
  {
    icon: '🌿',
    title: 'Commits as Trees',
    desc: 'Commit frequency grows trees and paths across your world, painting a picture of your consistency.',
  },
  {
    icon: '🗺️',
    title: 'Activity Heatmap',
    desc: 'Your contribution calendar becomes the terrain itself — active zones glow brighter.',
  },
  {
    icon: '🔗',
    title: 'Shareable Public Link',
    desc: 'Get a permanent public link to share with recruiters, on Twitter, LinkedIn, or your portfolio.',
  },
  {
    icon: '⚡',
    title: 'Real-time Generation',
    desc: 'Works with any public GitHub profile in seconds. No login or setup needed.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Enter GitHub Username',
    desc: 'Type any public GitHub username or paste a profile URL. No auth required.',
  },
  {
    number: '02',
    title: 'Generate Your World',
    desc: 'We fetch your repos, stars, and activity and render it as a unique 3D city in real time.',
  },
  {
    number: '03',
    title: 'Explore & Share',
    desc: 'Navigate the world, inspect repos, and share your public link anywhere.',
  },
];

const credibilities = [
  { label: 'Built for Developers', desc: 'Designed by devs, for devs. No marketing fluff.' },
  { label: 'Works with Public Profiles', desc: 'Any public GitHub profile — no sign-in needed.' },
  { label: 'Privacy Safe', desc: 'We never store your tokens or private data.' },
  { label: 'Fast Generation', desc: 'Your world is ready in seconds, not minutes.' },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-28 px-6 pb-24 pt-10 md:px-10">

      {/* ── NAVBAR ── */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-mint flex items-center justify-center shadow-glow">
            <span className="text-bg900 text-xs font-black">GW</span>
          </div>
          <span className="text-base font-bold tracking-tight">GitHub Profile World</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-text300 md:flex">
          <a href="#features" className="hover:text-text100 transition-colors">Features</a>
          <a href="#how" className="hover:text-text100 transition-colors">How it works</a>
          <Link href="/generate" className="hover:text-text100 transition-colors">Generate</Link>
          <Link href="/generate">
            <Button className="px-5 py-2 text-sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center min-h-[80vh]">
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

          <div className="flex flex-wrap items-center gap-6 text-sm text-text300 pt-4 font-mono-tech">
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

      {/* ── FEATURES ── */}
      <section id="features" className="stagger-in">
        <div className="text-center mb-14 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">What you get</p>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-white to-text300 bg-clip-text text-transparent">
            Every part of your profile, visualized
          </h2>
          <p className="text-text300 max-w-xl mx-auto text-lg">
            We map every GitHub data point to a visual element in your world.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="hover-lift group p-7 space-y-4 border-white/5 hover:border-mint/30 transition-all duration-300">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="text-lg font-bold text-text100">{f.title}</h3>
              <p className="text-sm text-text300 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="stagger-in">
        <div className="text-center mb-14 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Simple process</p>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-white to-text300 bg-clip-text text-transparent">
            How it works
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center gap-5 p-6">
              <div className="w-14 h-14 rounded-2xl border border-mint/30 bg-mint/10 flex items-center justify-center shadow-glow z-10">
                <span className="text-mint font-black text-lg font-mono-tech">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-text100">{step.title}</h3>
              <p className="text-sm text-text300 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/generate">
            <Button className="text-lg px-10 py-4 shadow-glow-strong bg-mint text-bg900 hover:bg-white transition-colors">
              Start Now — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* ── DEVELOPER CREDIBILITY ── */}
      <section className="stagger-in">
        <Card className="p-10 md:p-14 border-mint/20 shadow-glow">
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Built for devs</p>
            <h2 className="text-3xl font-extrabold md:text-4xl bg-gradient-to-r from-white to-text300 bg-clip-text text-transparent">
              Developer Credibility, first
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {credibilities.map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/8 bg-white/4 p-6 hover:border-mint/25 hover:bg-mint/5 transition-all duration-200 space-y-2">
                <div className="w-8 h-1 rounded-full bg-mint mb-4" />
                <p className="font-bold text-text100 text-base">{c.label}</p>
                <p className="text-sm text-text300 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-mint flex items-center justify-center shadow-glow">
            <span className="text-bg900 text-[9px] font-black">GW</span>
          </div>
          <span className="font-semibold text-text100">GitHub Profile World</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="https://github.com/shamshodbekdevops/GitHub_profileworld" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">
            GitHub Repo
          </a>
          <Link href="/generate" className="hover:text-mint transition-colors">
            Live Demo
          </Link>
          <a href="https://github.com/shamshodbekdevops" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">
            Creator
          </a>
        </div>
        <p className="text-xs text-text300/60">© 2026 GitHub Profile World. All rights reserved.</p>
      </footer>

    </main>
  );
}


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

