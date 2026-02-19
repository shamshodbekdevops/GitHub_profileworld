import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroPreview } from '@/components/world/hero-preview';

const sampleCompanies = ['Startup founders', 'Hiring teams', 'Open-source maintainers', 'Portfolio reviewers'];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-8 md:px-10">
      <header className="mb-10 flex items-center justify-between">
        <div className="text-lg font-bold tracking-wide">GitHub Profile World</div>
        <nav className="hidden items-center gap-6 text-sm text-text300 md:flex">
          <a href="#how">How it works</a>
          <a href="#proof">Social proof</a>
          <Link href="/generate">Generate</Link>
        </nav>
      </header>

      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
            Portfolio-grade GitHub storytelling
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Turn your GitHub profile into an interactive world recruiters remember.
          </h1>
          <p className="max-w-xl text-base text-text300 md:text-lg">
            Paste your username. We generate a beautiful 3D city where repos become buildings, commits grow forests, and stars power the skyline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/generate">
              <Button>Generate My World</Button>
            </Link>
            <Link href="/generate?sample=torvalds">
              <Button variant="secondary">Try with sample user</Button>
            </Link>
          </div>
        </div>
        <HeroPreview />
      </section>

      <section id="how" className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          ['Paste profile', 'Use username or full GitHub URL.'],
          ['Generate city', 'We map your repos, commits, stars, and languages into districts.'],
          ['Share link', 'Publish a read-only world for hiring managers and peers.'],
        ].map(([title, desc]) => (
          <Card key={title} className="p-5">
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="text-sm text-text300">{desc}</p>
          </Card>
        ))}
      </section>

      <section id="proof" className="mt-12">
        <Card className="p-6">
          <p className="mb-4 text-sm uppercase tracking-[0.16em] text-text300">Used in hiring conversations by</p>
          <div className="flex flex-wrap gap-3">
            {sampleCompanies.map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
