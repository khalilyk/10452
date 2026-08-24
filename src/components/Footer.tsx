/**
 * Copyright, and nothing else.
 *
 * The About and Contact links are gone: both are sections on this page now, and
 * the links pointed at /about and /contact — routes that do not exist and would
 * have 404'd.
 *
 * The year is computed rather than typed. A brand-new shop showing a copyright
 * two years stale reads as abandoned, and it is the first thing a careful
 * customer notices.
 */
export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-ink/10 bg-paper px-5 py-5 text-[11.5px] text-ink/70 sm:px-8 sm:text-[12.5px]">
      <span>© 10452.SPACE {new Date().getFullYear()}</span>
      <a
        href="https://printparadise.com.au"
        target="_blank"
        rel="noreferrer noopener"
        className="tracking-wide transition-opacity hover:opacity-60"
      >
        PRINTED WITH PRINT PARADISE
      </a>
    </footer>
  )
}
