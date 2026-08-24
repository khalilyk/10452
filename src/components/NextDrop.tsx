import { NEXT_DROP } from '../data/drops.ts'

/**
 * The next chapter, teased ahead of the reveal.
 *
 * Split screen like the rest of the page, but inverted within itself — ink
 * left, paper right — so it sits between the paper About section above and the
 * black shipping band below without repeating either.
 *
 * The right panel still isn't the real campaign shot; that has not been taken
 * yet. topsecret.jpg gives it something to sit on rather than flat ink: a
 * stack of blacked-out tees, visible enough under the overlay to read as a
 * tease rather than a reveal.
 */
export function NextDrop() {
  return (
    <section className="grid bg-cream lg:grid-cols-2" aria-labelledby="next-drop-heading">
      <div className="order-2 flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:py-24 lg:pl-14 lg:pr-16">
        <p className="text-[10.5px] tracking-widest text-ink/50">NEXT CHAPTER</p>

        <h2
          id="next-drop-heading"
          className="mt-3 text-[24px] font-medium leading-[1.25] tracking-[0.06em] sm:text-[30px]"
        >
          DROP {NEXT_DROP.number}
        </h2>

        <p className="mt-5 max-w-[30rem] text-[13px] leading-[1.95] text-ink/70">
          {NEXT_DROP.teaser}
        </p>

        <p className="mt-7 text-[11px] tracking-widest text-liban-red">
          REVEALS {NEXT_DROP.revealsAt}
        </p>
      </div>

      <div className="relative order-1 aspect-[4/3] overflow-hidden bg-ink lg:aspect-auto">
        <img
          src="/drops/topsecret.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/45" />
        <Hatch />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span
            aria-hidden
            className="text-[96px] font-medium leading-none tracking-tight text-white/10 sm:text-[140px]"
          >
            {NEXT_DROP.number}
          </span>
          <span className="text-[10px] tracking-widest text-white/40">CAMPAIGN LOCKED</span>
        </div>
      </div>
    </section>
  )
}

function Hatch() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.08]">
      <pattern id="next-drop-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="14" stroke="white" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#next-drop-hatch)" />
    </svg>
  )
}
