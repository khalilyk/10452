/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lebanese flag red and green, the cream of old paper, and the navy
        // that the postage-stamp artwork is printed in.
        ink: '#0A0A0A',
        paper: '#F2F1ED',
        cream: '#FAF9F6',
        liban: {
          red: '#C8102E',
          green: '#00733E',
          navy: '#1E2A54',
        },
      },
      fontFamily: {
        // One monospace face throughout. The brief asks for "an old receipt or
        // postal document", and a receipt is set in one width.
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: { widest: '0.18em' },
    },
  },
  plugins: [],
}
