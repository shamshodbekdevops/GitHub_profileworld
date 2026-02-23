import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg900: '#0A0A0A', // Deep dark background
        bg800: '#111111', // Slightly lighter dark
        bg700: '#1A1A1A', // Card background
        text100: '#EDEDED', // Primary text
        text300: '#A1A1AA', // Secondary text
        mint: '#00E59B', // Neon accent (primary)
        gold: '#F5A623', // Accent 2
        moss: '#34D399', // Accent 3
        clay: '#F87171', // Accent 4
        sand: '#FCD34D', // Accent 5
        danger: '#EF4444', // Error
        accent: '#3B82F6', // Blue accent
      },
      boxShadow: {
        glow: '0 0 40px rgba(0, 229, 155, 0.15)',
        'glow-strong': '0 0 60px rgba(0, 229, 155, 0.3)',
      },
      backdropBlur: {
        panel: '18px',
      },
    },
  },
  plugins: [],
};

export default config;
