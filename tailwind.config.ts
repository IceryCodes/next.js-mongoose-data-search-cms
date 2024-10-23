import type { Config } from 'tailwindcss';

export const headerHeight: number = 80;

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      height: {
        header: `${headerHeight}px`,
        content: `calc(100vh - ${headerHeight}px)`,
      },
      margin: {
        header: `${headerHeight}px`,
      },
    },
  },
  plugins: [],
};
export default config;
