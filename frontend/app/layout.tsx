import type { Metadata } from 'next';
import { JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google';

import { Providers } from '@/components/providers';

import './globals.css';

const heading = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'GitHub Profile World',
  description: 'Generate an interactive 3D world from your GitHub profile activity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg900 text-text100 antialiased">
        {/* Modern gradient background */}
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_20%_30%,rgba(93,214,160,.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(242,196,109,.22),transparent_40%),linear-gradient(135deg,#101215,#171B20_55%,#101215)]" />
        {/* Subtle grid overlay */}
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25" />
        {/* Soft vignette for depth */}
        <div className="pointer-events-none fixed inset-0 -z-5 bg-[radial-gradient(circle_at_50%_90%,rgba(16,18,21,0.7),transparent_70%)]" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
