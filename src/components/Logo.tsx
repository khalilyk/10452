/**
 * The mark: لبنان in red over 10452 in green, ruled off by SPACE.
 *
 * Drawn as text rather than an image so it stays crisp at any size, remains
 * selectable and searchable, and can be recoloured for a dark header without
 * shipping a second asset.
 */
export function Logo({ className = '', invert = false }: { className?: string; invert?: boolean }) {
  return (
    <a
      href="/"
      aria-label="10452.SPACE — home"
      /*
        inline-flex + items-start, not inline-block. With block children the
        anchor filled its grid cell, and `dir="rtl"` then aligned لبنان to the
        right of that full width — which put it in the middle of the header
        instead of above the numerals.
      */
      className={`inline-flex flex-col items-start leading-none ${className}`}
    >
      <span
        className={`block text-[26px] font-bold leading-[0.9] tracking-tight sm:text-[30px] ${
          invert ? 'text-white' : 'text-liban-red'
        }`}
        lang="ar"
      >
        لبنان
      </span>
      <span
        className={`mt-0.5 block text-[26px] font-bold leading-[0.9] tracking-[0.02em] sm:text-[30px] ${
          invert ? 'text-white' : 'text-ink'
        }`}
      >
        10452
      </span>
      <span className="mt-1 flex items-center gap-1.5">
        <Rule invert={invert} />
        <span
          className={`text-[9px] font-semibold tracking-[0.42em] sm:text-[10px] ${
            invert ? 'text-white' : 'text-liban-red'
          }`}
        >
          SPACE
        </span>
        <Rule invert={invert} />
      </span>
    </a>
  )
}

function Rule({ invert }: { invert: boolean }) {
  return (
    <span
      aria-hidden
      className={`h-[2px] w-2.5 ${invert ? 'bg-white' : 'bg-liban-red'}`}
    />
  )
}
