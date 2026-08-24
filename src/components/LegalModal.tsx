import { useEffect } from 'react'
import type { LegalSection } from '../data/legal.ts'

/**
 * Privacy policy / terms, as a popup rather than a route.
 *
 * The site has no router and both documents are short enough to read in
 * place — a full navigation away and back is more friction than the content
 * needs. Escape and a backdrop click both close it, and body scroll is
 * locked while it's open so the page behind doesn't scroll along with it.
 */
export function LegalModal({
  title,
  doc,
  onClose,
}: {
  title: string
  doc: { updated: string; sections: LegalSection[] }
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 px-0 sm:items-center sm:px-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-heading"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-xl flex-col bg-cream sm:max-h-[80vh]"
      >
        <div className="flex items-start justify-between gap-6 border-b border-ink/15 px-6 py-5 sm:px-8">
          <div>
            <h2 id="legal-modal-heading" className="text-[18px] font-medium tracking-[0.06em] sm:text-[20px]">
              {title}
            </h2>
            <p className="mt-1 text-[10.5px] tracking-widest text-ink/50">
              LAST UPDATED {doc.updated.toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mt-0.5 shrink-0 text-[13px] tracking-widest text-ink/60 transition-opacity hover:opacity-60"
          >
            CLOSE ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <div className="max-w-[38rem] space-y-6">
            {doc.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-[11px] tracking-widest text-ink/50">
                  {section.heading.toUpperCase()}
                </h3>
                <div className="mt-2 space-y-2.5 text-[13px] leading-[1.85] text-ink/80">
                  {section.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
