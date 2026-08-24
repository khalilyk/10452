import { GIVING } from '../data/drops.ts'

/**
 * The giving-back promise, flag green over the Cedars.
 *
 * Green stays the fill — everywhere else on the site is ink, paper or cream,
 * so this section standing in the flag's colour is what marks it as a
 * different kind of claim, not more copy. The cedar photo sits underneath at
 * low visibility, there for texture rather than to compete with the green or
 * the text on top of it.
 */
export function GivingBack() {
  return (
    <section className="relative overflow-hidden px-5 py-20 text-center sm:py-28" aria-labelledby="giving-heading">
      <img
        src="/drops/cedars.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-liban-green/85" />

      <div className="relative">
        <p className="text-[10.5px] tracking-widest text-white/85">GIVING BACK</p>
        <h2
          id="giving-heading"
          className="mt-3 text-[26px] font-medium tracking-[0.14em] text-white sm:text-[38px]"
        >
          {GIVING.amount} FROM EVERY SALE
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[12px] leading-relaxed tracking-wide text-white/85">
          Goes toward {GIVING.charity}: {GIVING.charityBlurb}.
        </p>
      </div>
    </section>
  )
}
