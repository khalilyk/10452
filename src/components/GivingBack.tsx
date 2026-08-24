import { GIVING } from '../data/drops.ts'

/**
 * The giving-back promise, full bleed in flag green.
 *
 * First use of liban.green as a fill rather than an accent — everywhere else
 * on the site is ink, paper or cream, so one section actually standing in the
 * flag's colour marks this as a different kind of claim, not just more copy.
 */
export function GivingBack() {
  return (
    <section className="bg-liban-green px-5 py-20 text-center sm:py-28" aria-labelledby="giving-heading">
      <p className="text-[10.5px] tracking-widest text-white/85">GIVING BACK</p>
      <h2
        id="giving-heading"
        className="mt-3 text-[26px] font-medium tracking-[0.14em] text-white sm:text-[38px]"
      >
        {GIVING.amount} FROM EVERY SALE
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-[12px] leading-relaxed tracking-wide text-white/85">
        Goes toward {GIVING.charity}.
      </p>
    </section>
  )
}
