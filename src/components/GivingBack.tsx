import { GIVING } from '../data/drops.ts'

/**
 * The giving-back promise, flag green over the Cedars.
 *
 * Green stays the fill — everywhere else on the site is ink, paper or cream,
 * so this section standing in the flag's colour is what marks it as a
 * different kind of claim, not more copy. The cedar photo sits underneath at
 * low visibility, there for texture rather than to compete with the green or
 * the text on top of it.
 *
 * Split like the rest of the page: the WDBF mark (a white PNG made for a dark
 * background, which is exactly what it's sitting on here) leads on its own
 * half rather than sitting small under the copy, the way About's photo leads
 * before its text on mobile.
 */
export function GivingBack() {
  return (
    <section className="relative grid overflow-hidden lg:grid-cols-2" aria-labelledby="giving-heading">
      <img
        src="/drops/cedars.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-liban-green/85" />

      <div className="relative flex items-center justify-center px-5 py-14 sm:py-20 lg:py-28">
        <img
          src="/charity/wedeservelogo_footer.png"
          alt="We Deserve Better Foundation"
          className="h-32 w-auto sm:h-40 lg:h-48"
        />
      </div>

      <div className="relative flex flex-col justify-center px-5 pb-16 text-center sm:px-8 sm:pb-20 lg:py-28 lg:pl-4 lg:pr-16 lg:text-left">
        <p className="text-[10.5px] tracking-widest text-white/85">GIVING BACK</p>
        <h2
          id="giving-heading"
          className="mt-3 text-[26px] font-medium tracking-[0.14em] text-white sm:text-[38px]"
        >
          {GIVING.amount} FROM EVERY SALE
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[12px] leading-relaxed tracking-wide text-white/85 lg:mx-0">
          Goes toward {GIVING.charity}: {GIVING.charityBlurb}.
        </p>
      </div>
    </section>
  )
}
