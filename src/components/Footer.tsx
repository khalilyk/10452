/**
 * Copyright, and the only two links off the page.
 *
 * The year is computed rather than typed. A brand-new shop showing a copyright
 * two years stale reads as abandoned, and it is the first thing a careful
 * customer notices.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-col gap-4 border-t border-ink/10 bg-paper px-5 py-5 text-[11.5px] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-[12.5px]">
      <span className="text-ink/70">© 10452.SPACE {year}</span>

      <nav className="flex items-center gap-8">
        <FooterLink href="/about">About us</FooterLink>
        <FooterLink href="/contact">Contact</FooterLink>
      </nav>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 underline underline-offset-[6px] transition-opacity hover:opacity-60"
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}
