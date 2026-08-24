import { useState } from 'react'
import { LegalModal } from './LegalModal.tsx'
import { PRIVACY_POLICY, TERMS } from '../data/legal.ts'

/**
 * Copyright, a printer credit, and the two legal links underneath.
 *
 * The About and Contact links are gone: both are sections on this page now, and
 * the links pointed at /about and /contact — routes that do not exist and would
 * have 404'd. Privacy and terms have real content but nowhere to route to
 * either, so they open as a popup instead of a page.
 *
 * The year is computed rather than typed. A brand-new shop showing a copyright
 * two years stale reads as abandoned, and it is the first thing a careful
 * customer notices.
 */
export function Footer() {
  const [open, setOpen] = useState<'privacy' | 'terms' | null>(null)

  return (
    <>
      <footer className="border-t border-ink/10 bg-paper px-5 py-5 text-[11.5px] text-ink/70 sm:px-8 sm:text-[12.5px]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span>© 10452.SPACE {new Date().getFullYear()}</span>
          <a
            href="https://printparadise.com.au"
            target="_blank"
            rel="noreferrer noopener"
            className="tracking-wide transition-opacity hover:opacity-60"
          >
            PRINTED WITH PRINT PARADISE
          </a>
        </div>

        <div className="mt-2 flex gap-4 text-[10.5px] tracking-wide text-ink/50 sm:text-[11px]">
          <button type="button" onClick={() => setOpen('privacy')} className="transition-opacity hover:opacity-60">
            PRIVACY POLICY
          </button>
          <button type="button" onClick={() => setOpen('terms')} className="transition-opacity hover:opacity-60">
            TERMS &amp; CONDITIONS
          </button>
        </div>
      </footer>

      {open === 'privacy' && (
        <LegalModal title="Privacy Policy" doc={PRIVACY_POLICY} onClose={() => setOpen(null)} />
      )}
      {open === 'terms' && (
        <LegalModal title="Terms & Conditions" doc={TERMS} onClose={() => setOpen(null)} />
      )}
    </>
  )
}
