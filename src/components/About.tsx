import { ABOUT, MANIFESTO } from '../data/drops.ts'

/**
 * The brand, in one screen.
 *
 * Split: words left, picture right. On a phone the picture leads, because a
 * paragraph of manifesto is a poor first impression on a small screen and an
 * image is not.
 */
export function About() {
  return (
    <section
      id="about"
      className="grid border-t border-ink/10 bg-cream lg:grid-cols-2"
      aria-labelledby="about-heading"
    >
      {/* The measure was max-w-md inside a 900px column, which left a third of
          the panel empty and made the text look stranded. Widened, with padding
          that matches the rhythm of the sections above. */}
      <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-8 sm:py-20 lg:order-1 lg:py-28 lg:pl-16 lg:pr-14">
        <p className="text-[10.5px] tracking-widest text-ink/45">ABOUT</p>

        <h2
          id="about-heading"
          className="mt-3 max-w-[34rem] text-[24px] font-medium leading-[1.25] tracking-[0.06em] sm:text-[30px]"
        >
          {ABOUT.heading}
        </h2>

        <div className="mt-6 max-w-[34rem] space-y-4 text-[13px] leading-[1.95] sm:text-[13.5px]">
          {ABOUT.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* The promise, set as a rule of figures rather than a sentence. */}
        <dl className="mt-10 grid max-w-[34rem] grid-cols-3 border-t border-ink/15 pt-5">
          <Figure value={String(MANIFESTO.drops)} label="DROPS" />
          <Figure value={String(MANIFESTO.pieces)} label="PIECES EACH" />
          <Figure value="0" label="REPEATS" />
        </dl>
      </div>

      <div className="order-1 lg:order-2">
        {ABOUT.image ? (
          <img
            src={ABOUT.image}
            alt={ABOUT.imageCaption}
            className="h-full min-h-[18rem] w-full object-cover"
          />
        ) : (
          <ImagePending caption={ABOUT.imageCaption} />
        )}
      </div>
    </section>
  )
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-[26px] font-medium leading-none text-liban-red sm:text-[30px]">
          {value}
        </span>
        <span className="mt-1.5 block text-[9.5px] tracking-widest text-ink/55">{label}</span>
      </dd>
    </div>
  )
}

/** Same contact-sheet language as the campaign slot, so the two agree. */
function ImagePending({ caption }: { caption: string }) {
  return (
    <div className="relative flex h-full min-h-[18rem] items-center justify-center bg-paper lg:min-h-[34rem]">
      <span aria-hidden className="absolute left-4 top-4 h-6 w-px bg-ink/25" />
      <span aria-hidden className="absolute left-4 top-4 h-px w-6 bg-ink/25" />
      <span aria-hidden className="absolute bottom-4 right-4 h-6 w-px bg-ink/25" />
      <span aria-hidden className="absolute bottom-4 right-4 h-px w-6 bg-ink/25" />
      <span className="text-[11px] tracking-widest text-ink/35">
        {caption.toUpperCase()}
      </span>
    </div>
  )
}
