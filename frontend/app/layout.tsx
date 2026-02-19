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
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(93,214,160,.16),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(242,196,109,.18),transparent_38%),linear-gradient(160deg,#101215,#171B20_45%,#101215)]" />
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
