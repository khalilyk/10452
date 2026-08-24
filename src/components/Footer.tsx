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
    <footer className="border-t border-ink/10 bg-paper px-5 py-5 text-[11.5px] text-ink/70 sm:px-8 sm:text-[12.5px]">
      © 10452.SPACE {new Date().getFullYear()}
    </footer>
  )
}
