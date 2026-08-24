/**
 * A full-bleed band carrying one line.
 *
 * Static. It scrolled at first, but the sentence is a promise about how the
 * garments are made, not decoration — a claim someone should be able to read
 * once and be sure of. Moving type makes that harder for everyone and
 * measurably harder for anyone who reads slowly.
 *
 * The marks either side are the only ornament, and they carry the red.
 */
export function Marquee({
  text, invert = false,
}: {
  text: string
  /** White on black, so the band reads as a rule between sections. */
  invert?: boolean
}) {
  return (
    <div
      className={`w-full px-5 py-4 text-center sm:px-8 ${
        invert ? 'bg-ink text-white' : 'border-y border-ink/15 bg-cream'
      }`}
    >
      <p className="text-[10.5px] font-medium uppercase leading-relaxed tracking-widest sm:text-[12px]">
        <span aria-hidden className="mr-4 text-liban-red">✦</span>
        {text}
        <span aria-hidden className="ml-4 text-liban-red">✦</span>
      </p>
    </div>
  )
}
