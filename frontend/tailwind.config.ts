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
        bg900: '#070B14',
        bg800: '#0D1322',
        text100: '#EAF2FF',
        text300: '#A9B7D4',
        cyan: '#3EE7FF',
        blue: '#3B82F6',
        lime: '#9DFF6B',
        amber: '#F7C948',
        danger: '#FF5D73',
      },
      boxShadow: {
        glow: '0 0 60px rgba(62, 231, 255, 0.2)',
      },
      backdropBlur: {
        panel: '18px',
      },
    },
  },
  plugins: [],
};

export default config;
