/**
 * A full-bleed band of scrolling type.
 *
 * The line is duplicated and the track translated by exactly half its width, so
 * the loop has no seam — the copy that leaves one side is already in position on
 * the other. `aria-hidden` on the duplicate keeps a screen reader from reading
 * the sentence twice.
 *
 * Stops under prefers-reduced-motion, where it becomes a static band.
 */
export function Marquee({
  text, direction = 'right', seconds = 34, invert = false,
}: {
  text: string
  /** Which way the type travels. */
  direction?: 'left' | 'right'
  seconds?: number
  /** White on black, so the band reads as a rule between sections. */
  invert?: boolean
}) {
  const copies = [0, 1]

  return (
    <div
      className={`relative w-full overflow-hidden py-3.5 ${
        invert ? 'bg-ink text-white' : 'border-y border-ink/15 bg-cream'
      }`}
    >
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div
        className="marquee-track flex w-max"
        style={{ animation: `marquee-${direction} ${seconds}s linear infinite` }}
      >
        {copies.map((c) => (
          <div key={c} aria-hidden={c === 1} className="flex shrink-0">
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-6 text-[11px] font-medium uppercase tracking-widest sm:text-[12.5px]"
              >
                {text}
                <span className="px-6 text-liban-red">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
