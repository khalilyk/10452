/**
 * The chair, alone, before the copyright line.
 *
 * Same asset as the favicon — the brand's smallest mark, given one moment of
 * space to itself rather than only ever appearing tab-sized.
 */
export function FooterMark() {
  return (
    <div className="border-t border-ink/10 bg-cream px-5 py-10 sm:py-14">
      <img
        src="/brand/favicon.png"
        alt=""
        aria-hidden
        className="mx-auto h-14 w-auto opacity-80 sm:h-16"
      />
    </div>
  )
}
