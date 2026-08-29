import { useEffect, useState } from 'react'
import { useContent } from '../content/ContentContext.tsx'

const DISMISS_KEY = '10452-gift-modal-dismissed'
const DELAY_MS = 3500

/**
 * A free-gift email capture.
 *
 * Single column on mobile (small chair, then the offer) so it doesn't take
 * over a small screen; a split screen on desktop (chair filling a black
 * panel on the left, offer and form on the right) once there's room for it.
 * One inner frame wraps the whole card either way, so it reads as one
 * ticket rather than two things stuck together.
 *
 * Shows once per browser, after a short delay rather than on load — a modal
 * covering the page before anyone has seen it reads as a wall, not an offer.
 * Submits through the same /api/submit endpoint the contact form uses, so an
 * address collected here shows up in Submissions like any other message,
 * with nothing new to wire up.
 */
export function GiftModal() {
  const { brand } = useContent()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return
    const id = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [visible])

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError('Enter an email first.'); return }
    setError(null)
    setState('busy')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', email, message: 'Free gift signup' }),
      })
      const body = await res.json().catch(() => null)
      if (body?.ok) {
        setState('done')
        localStorage.setItem(DISMISS_KEY, '1')
        return
      }
      setState('idle')
      setError('That did not go through. Try again in a moment.')
    } catch {
      setState('idle')
      setError('That did not go through. Try again in a moment.')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 px-0 sm:items-center sm:px-5" onClick={dismiss}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-modal-heading"
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-md overflow-visible bg-white sm:max-w-2xl sm:grid-cols-2"
      >
        {/* An inner frame around the whole card rather than a second outer
            border, so it reads like one ticket, not two panels stuck
            together. */}
        <div aria-hidden className="pointer-events-none absolute inset-[10px] z-10 border-2 border-ink" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 text-[13px] tracking-widest text-ink/50 transition-opacity hover:opacity-60 sm:text-white/70 sm:hover:text-white"
        >
          ✕
        </button>

        <div className="flex items-center justify-center bg-white px-6 pt-10 sm:bg-ink sm:px-8 sm:py-12">
          <img
            src={brand.faviconUrl}
            alt=""
            aria-hidden
            className="h-20 w-auto sm:h-48 sm:invert"
          />
        </div>

        <div className="px-6 py-10 text-center sm:px-10 sm:text-left">
          <p className="text-[11px] tracking-widest text-ink/50">
            <span aria-hidden className="mr-2 text-liban-red">✦</span>
            THIS DROP ONLY
            <span aria-hidden className="ml-2 text-liban-red">✦</span>
          </p>
          <h2
            id="gift-modal-heading"
            className="mt-2 text-[42px] font-bold uppercase leading-[0.9] tracking-tight text-liban-red sm:text-[52px]"
          >
            Surprise Gift
          </h2>

          {state === 'done' ? (
            <p className="mx-auto mt-5 max-w-xs text-[13px] leading-relaxed text-ink/75 sm:mx-0">
              You're on the list. We'll email you before the gift or the drop runs out.
            </p>
          ) : (
            <>
              <p className="mx-auto mt-4 max-w-xs text-[14px] leading-relaxed text-ink sm:mx-0">
                <span className="font-bold">Free with every tee this drop:</span> a
                surprise straight from Batroun, no extra cost.
              </p>

              <form onSubmit={submit} className="mt-6 text-left">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-label="Email"
                  className="h-[50px] w-full border border-ink/25 bg-transparent px-4 text-[13px] text-ink outline-none transition-colors focus:border-ink"
                  placeholder="Enter your email address"
                />

                <button
                  type="submit"
                  disabled={state === 'busy'}
                  className="mt-3 h-[52px] w-full bg-ink text-[13px] font-bold tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {state === 'busy' ? 'ONE MOMENT…' : 'CLAIM MY GIFT'}
                </button>

                {error && (
                  <p className="mt-3 text-[11.5px] leading-relaxed text-liban-red" role="alert">
                    {error}
                  </p>
                )}
              </form>

              <button
                type="button"
                onClick={dismiss}
                className="mt-4 text-[11.5px] tracking-wide text-ink/40 underline-offset-4 transition-colors hover:text-ink/60 hover:underline"
              >
                Not interested
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
