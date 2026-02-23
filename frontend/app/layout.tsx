import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

import { Providers } from '@/components/providers';

import './globals.css';

const heading = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
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
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_20%_30%,rgba(0,229,155,.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,.15),transparent_40%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />
        {/* Subtle grid overlay */}
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
        {/* Soft vignette for depth */}
        <div className="pointer-events-none fixed inset-0 -z-5 bg-[radial-gradient(circle_at_50%_90%,rgba(10,10,10,0.8),transparent_70%)]" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
