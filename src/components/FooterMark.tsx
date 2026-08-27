import { useContent } from '../content/ContentContext.tsx'

/**
 * The chair, alone, before the copyright line.
 *
 * Same asset as the favicon — the brand's smallest mark, given one moment of
 * space to itself rather than only ever appearing tab-sized. Hovering it
 * surfaces "HABIBI INTA" — a small aside for whoever lingers, not a label
 * everyone needs, which is why it is a hover tooltip rather than visible copy.
 */
export function FooterMark() {
  const { brand } = useContent()
  return (
    <div className="border-t border-ink/10 bg-cream px-5 py-10 sm:py-14">
      <div className="group relative mx-auto w-fit">
        <img
          src={brand.faviconUrl}
          alt=""
          aria-hidden
          className="h-[84px] w-auto opacity-80 sm:h-24"
        />

        <div
          role="tooltip"
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm bg-ink px-3 py-1.5 text-[11px] font-bold tracking-widest text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        >
          HABIBI INTA
          <span
            aria-hidden
            className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ink"
          />
        </div>
      </div>
    </div>
  )
}
