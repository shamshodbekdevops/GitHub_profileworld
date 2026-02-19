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
        bg900: '#101215',
        bg800: '#171B20',
        text100: '#F4F1EA',
        text300: '#B7B0A2',
        mint: '#5DD6A0',
        gold: '#F2C46D',
        moss: '#7DBB6F',
        clay: '#CF7A58',
        sand: '#DCC9A3',
        danger: '#FF5D73',
      },
      boxShadow: {
        glow: '0 0 60px rgba(93, 214, 160, 0.2)',
      },
      backdropBlur: {
        panel: '18px',
      },
    },
  },
  plugins: [],
};

export default config;
