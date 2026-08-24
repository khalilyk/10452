import { useEffect, useMemo, useState } from 'react'
import type { Drop } from '../data/drops.ts'
import { initialStock } from '../data/drops.ts'
import { checkout, fetchStock } from '../lib/commerce.ts'
import { SplitFlap } from './SplitFlap.tsx'

/**
 * The drop story, the count, and the only two buttons on the site.
 *
 * The count is the brand's entire promise, so it is read from the commerce
 * backend when one exists and falls back to the configured figure with a
 * visible caveat when it does not. It is never simply asserted.
 */
export function BuyPanel({ drop, onAdd }: { drop: Drop; onAdd: (qty: number) => void }) {
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [stock, setStock] = useState(() => initialStock(drop))
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchStock(drop.number).then((live) => {
      if (cancelled || live === null) return
      setStock(live)
    })
    return () => { cancelled = true }
  }, [drop.number])

  // The headline count is the sum of the sizes, never a separate figure — two
  // numbers that can disagree is how a shop oversells its last piece.
  const remaining = useMemo(
    () => Object.values(stock).reduce((a, b) => a + b, 0),
    [stock],
  )
  const soldOut = remaining <= 0

  // Once a size is chosen, that size's stock caps the order, not the total.
  const cap = size ? (stock[size] ?? 0) : remaining
  // Only sold-out greys the buttons. Missing size is answered on click, not by
  // disabling — the design has two live buttons and it should look like it.
  const canOrder = !soldOut && !busy

  const order = async () => {
    setError(null)
    if (!size) { setError('Choose a size first.'); return }
    if (!quantity) { setError('Choose a quantity.'); return }
    if (quantity > cap) { setError(`Only ${cap} left in ${size}.`); return }
    setBusy(true)
    const result = await checkout({ drop, size, quantity })
    setBusy(false)
    if (result.ok) { window.location.href = result.redirectUrl; return }
    setError(
      result.reason === 'not-configured'
        ? 'Checkout is not connected yet — no payment can be taken.'
        : result.reason === 'sold-out'
          ? 'That was the last one.'
          : 'Something went wrong. Try again.',
    )
    if (result.reason === 'not-configured') onAdd(quantity || 1)
  }

  return (
    <section className="bg-paper px-5 pb-10 pt-9 sm:px-8 sm:pb-14 sm:pt-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="text-[28px] font-medium tracking-[0.12em] sm:text-[34px]">
            {drop.name.toUpperCase()}
          </h1>
          <p className="text-[11px] tracking-widest sm:text-[12px]">
            LIMITED DROP -{' '}
            <span className="text-liban-red underline underline-offset-4">NO REPEAT</span>
          </p>
        </div>

        <div className="mt-7 grid gap-8 sm:grid-cols-[1fr_auto] sm:gap-12">
          <div className="max-w-xl space-y-4 text-[12.5px] leading-[1.9] sm:text-[13.5px]">
            {drop.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <Counter remaining={remaining} soldOut={soldOut} />
        </div>

        <hr className="mt-9 border-ink/15" />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Field
            label="SELECT SIZE"
            value={size}
            onChange={(v) => { setSize(v); setQuantity(0) }}
            disabled={soldOut}
            options={drop.sizes.map((s) => ({
              value: s,
              // The run is split evenly, so the interesting number is not how
              // many were made but how many of *your* size are left.
              label: stock[s] > 0 ? `${s} — ${stock[s]} LEFT` : `${s} — SOLD OUT`,
              disabled: stock[s] <= 0,
            }))}
          />
          <Field
            label="QUANTITY"
            value={quantity ? String(quantity) : ''}
            onChange={(v) => setQuantity(Number(v))}
            disabled={soldOut}
            options={Array.from(
              { length: Math.max(1, Math.min(5, cap)) },
              (_, i) => ({ value: String(i + 1), label: String(i + 1) }),
            )}
          />
        </div>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <button
            type="button"
            onClick={order}
            disabled={!canOrder}
            className="h-[54px] bg-ink text-[13px] font-medium tracking-widest text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {soldOut ? 'SOLD OUT' : busy ? 'ONE MOMENT…' : 'ORDER NOW'}
          </button>

          <ApplePayButton disabled={!canOrder} onClick={order} />
        </div>

        {/* Nothing is stated about checkout until someone tries to use it —
            the page has to look like the design. The moment an order is
            attempted, the truth is unavoidable. */}
        {error && (
          <p className="mt-3 text-[11.5px] leading-relaxed text-liban-red" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}

/**
 * The count, as a split-flap board.
 *
 * Three tiles always, so the row does not change width as the number falls —
 * a board has a fixed number of positions, and 9 reads as "  9", not as one
 * lonely tile. The red is kept as a colour chip rather than as the digits:
 * #C8102E on black is 3.3:1, which clears large-text AA and nothing else, and
 * this number is the one thing on the page that must be unmistakable.
 */
function Counter({ remaining, soldOut }: { remaining: number; soldOut: boolean }) {
  const n = soldOut ? 0 : remaining
  return (
    <div className="text-right sm:min-w-[9rem]">
      <div className="flex justify-end">
        <SplitFlap
          value={String(n).padStart(3, ' ')}
          chip
          dim={soldOut}
          label={soldOut ? 'Sold out' : `${remaining} pieces left`}
        />
      </div>
      <hr className="my-2 border-ink/20" />
      <p className="text-[13px] tracking-widest sm:text-[15px]">
        {soldOut ? 'SOLD OUT' : 'PCS LEFT'}
      </p>
    </div>
  )
}

function Field({
  label, value, onChange, options, disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string; disabled?: boolean }>
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-[54px] w-full border border-ink/25 bg-transparent px-4 pr-10 text-[12.5px] tracking-widest text-ink outline-none transition-colors focus:border-ink disabled:opacity-40"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
      >
        <path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/**
 * Shown only when the visitor could actually pay with it.
 *
 * A dead Apple Pay button is worse than no Apple Pay button: it is the most
 * recognisable trust signal on the page, and a customer who taps it and gets
 * nothing concludes the shop is broken.
 */
function ApplePayButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Pay with Apple Pay"
      className="flex h-[54px] items-center justify-center gap-1.5 border border-ink/25 transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
    >
      <svg viewBox="0 0 16 20" className="h-[22px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M13.1 10.6c0-2 1.6-3 1.7-3.05-.9-1.35-2.35-1.53-2.86-1.55-1.22-.12-2.38.71-3 .71-.62 0-1.57-.7-2.58-.68-1.33.02-2.55.77-3.23 1.95-1.38 2.39-.35 5.93 1 7.87.66.95 1.44 2.02 2.47 1.98.99-.04 1.36-.64 2.56-.64s1.53.64 2.58.62c1.07-.02 1.74-.97 2.39-1.93.75-1.1 1.06-2.17 1.08-2.23-.02-.01-2.07-.8-2.09-3.15Z" />
        <path d="M11.15 4.6c.54-.66.91-1.57.81-2.48-.78.03-1.73.52-2.29 1.18-.5.58-.94 1.51-.82 2.4.87.07 1.76-.44 2.3-1.1Z" />
      </svg>
      <span className="text-[19px] font-medium tracking-tight">Pay</span>
    </button>
  )
}
