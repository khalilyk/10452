import { useEffect, useState } from 'react'
import { useContent } from '../content/ContentContext.tsx'

const DISMISS_KEY = '10452-gift-modal-dismissed'
const DELAY_MS = 3500

/**
 * A free-gift email capture, in the same wireframe language as the rest of
 * the site: the chair line-art (the favicon asset, already drawn exactly
 * this way) filling one black half, the offer and form on the other.
 *
 * Shown once per browser, after a short delay rather than on load — a modal
 * covering the page before anyone has seen it reads as a wall, not an offer.
 * Submits through the same /api/submit endpoint the contact form uses, so
 * an address collected here shows up in Submissions like any other message,
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
        className="grid w-full max-w-3xl overflow-hidden bg-cream sm:grid-cols-2"
      >
        <div className="relative order-2 flex aspect-[4/3] items-center justify-center bg-ink sm:order-1 sm:aspect-auto">
          <Hatch />
          <img src={brand.faviconUrl} alt="" aria-hidden className="relative h-40 w-auto invert sm:h-52" />
        </div>

        <div className="relative order-1 flex flex-col justify-center px-6 py-9 sm:order-2 sm:px-9 sm:py-10">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-4 top-4 text-[13px] tracking-widest text-ink/50 transition-opacity hover:opacity-60"
          >
            ✕
          </button>

          <p className="text-[11px] tracking-widest text-ink/50">
            <span aria-hidden className="mr-2 text-liban-red">✦</span>
            THIS DROP ONLY
            <span aria-hidden className="ml-2 text-liban-red">✦</span>
          </p>
          <h2
            id="gift-modal-heading"
            className="mt-2 text-[46px] font-bold uppercase leading-[0.88] tracking-tight text-liban-red sm:text-[60px]"
          >
            Surprise
            <br />
            Gift
          </h2>

          {state === 'done' ? (
            <p className="mt-5 text-[13px] leading-relaxed text-ink/75">
              You're on the list. We'll email you before the gift or the drop runs out.
            </p>
          ) : (
            <>
              <p className="mt-4 text-[14px] leading-relaxed text-ink">
                <span className="font-bold">Free with every tee this drop:</span> a
                surprise straight from Batroun, no extra cost. Leave your
                email and we'll let you know before it runs out.
              </p>

              <form onSubmit={submit} className="mt-6">
                <label className="block">
                  <span className="text-[10px] tracking-widest text-ink/50">EMAIL</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="mt-2 h-[50px] w-full border border-ink/25 bg-transparent px-4 text-[13px] text-ink outline-none transition-colors focus:border-ink"
                    placeholder="you@example.com"
                  />
                </label>

                <button
                  type="submit"
                  disabled={state === 'busy'}
                  className="mt-3 h-[52px] w-full bg-liban-red text-[13px] font-bold tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {state === 'busy' ? 'ONE MOMENT…' : 'CLAIM MY GIFT'}
                </button>

                {error && (
                  <p className="mt-3 text-[11.5px] leading-relaxed text-liban-red" role="alert">
                    {error}
                  </p>
                )}
              </form>

              <p className="mt-4 text-[10.5px] leading-relaxed text-ink/40">
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Hatch() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.08]">
      <pattern id="gift-modal-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="14" stroke="white" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#gift-modal-hatch)" />
    </svg>
  )
}
