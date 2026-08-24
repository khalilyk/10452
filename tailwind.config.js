/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lebanese flag red and green, the cream of old paper, and the navy
        // that the postage-stamp artwork is printed in.
        ink: '#0A0A0A',
        // A mid grey for the contact details, so the section separates from the
        // black shipping band above without going all the way to paper.
        //
        // Named graphite, not slate: Tailwind ships a `slate` colour *scale*,
        // and overriding it with a single string produced no `bg-slate` class
        // at all — the panel rendered transparent with white text on cream.
        graphite: '#2C2C2C',
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
