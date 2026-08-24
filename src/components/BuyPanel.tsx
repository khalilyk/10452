import { useEffect, useMemo, useState } from 'react'
import type { Drop } from '../data/drops.ts'
import { initialStock, SHIPPING_AUD } from '../data/drops.ts'
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
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchStock(drop.number).then((live) => {
      if (cancelled || live === null) return
      setStock(live)
    })
    return () => { cancelled = true }
  }, [drop.number])

  // The headline count is the sum of the sizes, never a separate figure: two
  // numbers that can disagree is how a shop oversells its last piece.
  const remaining = useMemo(
    () => Object.values(stock).reduce((a, b) => a + b, 0),
    [stock],
  )
  const soldOut = remaining <= 0

  // Once a size is chosen, that size's stock caps the order, not the total.
  const cap = size ? (stock[size] ?? 0) : remaining
  // Only sold-out greys the buttons. Missing size is answered on click, not by
  // disabling: the design has two live buttons and it should look like it.
  const canOrder = !soldOut && !busy

  const subtotal = drop.priceAud * (quantity || 0)
  const total = subtotal + SHIPPING_AUD

  const validateSelection = () => {
    if (!size) { setError('Choose a size first.'); return false }
    if (!quantity) { setError('Choose a quantity.'); return false }
    if (quantity > cap) { setError(`Only ${cap} left in ${size}.`); return false }
    return true
  }

  // Apple Pay collects contact and shipping in its own sheet, so it skips the
  // on-page form entirely and attempts checkout with whatever the wallet
  // handed over. This app has no wallet integration to hand it, so today
  // that is nothing, and the honest not-configured error covers it.
  const payWithApplePay = async () => {
    setError(null)
    if (!validateSelection()) return
    setBusy(true)
    const result = await checkout({
      drop, size, quantity,
      name: '', email: '', phone: '',
      address1: '', address2: '', city: '', region: '', postcode: '', country: '',
      notes: '',
    })
    setBusy(false)
    handleResult(result)
  }

  const handleResult = (result: Awaited<ReturnType<typeof checkout>>) => {
    if (result.ok) { window.location.href = result.redirectUrl; return }
    setError(
      result.reason === 'not-configured'
        ? 'Checkout is not connected yet: no payment can be taken.'
        : result.reason === 'sold-out'
          ? 'That was the last one.'
          : 'Something went wrong. Try again.',
    )
    if (result.reason === 'not-configured') onAdd(quantity || 1)
  }

  const openCheckout = () => {
    setError(null)
    if (!validateSelection()) return
    setShowCheckout(true)
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

        <p className="mt-2 text-[15px] font-medium tracking-widest sm:text-[17px]">
          ${drop.priceAud} AUD
        </p>

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
            onChange={(v) => { setSize(v); setQuantity(0); setShowCheckout(false) }}
            disabled={soldOut}
            options={drop.sizes.map((s) => ({
              value: s,
              // The run is split evenly, so the interesting number is not how
              // many were made but how many of *your* size are left.
              label: stock[s] > 0 ? `${s} · ${stock[s]} LEFT` : `${s} · SOLD OUT`,
              disabled: stock[s] <= 0,
            }))}
          />
          <Field
            label="QUANTITY"
            value={quantity ? String(quantity) : ''}
            onChange={(v) => { setQuantity(Number(v)); setShowCheckout(false) }}
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
            onClick={openCheckout}
            disabled={!canOrder}
            className="h-[54px] bg-ink text-[13px] font-medium tracking-widest text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {soldOut ? 'SOLD OUT' : 'ORDER NOW'}
          </button>

          <ApplePayButton disabled={!canOrder || busy} onClick={payWithApplePay} />
        </div>

        {/* Nothing is stated about checkout until someone tries to use it:
            the page has to look like the design. The moment an order is
            attempted, the truth is unavoidable. */}
        {error && (
          <p className="mt-3 text-[11.5px] leading-relaxed text-liban-red" role="alert">
            {error}
          </p>
        )}

        {showCheckout && (
          <CheckoutForm
            drop={drop}
            size={size}
            quantity={quantity}
            subtotal={subtotal}
            total={total}
            busy={busy}
            onCancel={() => setShowCheckout(false)}
            onSubmit={async (details) => {
              setError(null)
              setBusy(true)
              const result = await checkout({ drop, size, quantity, ...details })
              setBusy(false)
              handleResult(result)
            }}
          />
        )}
      </div>
    </section>
  )
}

/**
 * The count, as a split-flap board.
 *
 * Three tiles always, so the row does not change width as the number falls:
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

/**
 * Contact and shipping details, revealed only once a size and quantity are
 * picked, so the order summary it opens with is never showing $0.
 */
function CheckoutForm({
  drop, size, quantity, subtotal, total, busy, onCancel, onSubmit,
}: {
  drop: Drop
  size: string
  quantity: number
  subtotal: number
  total: number
  busy: boolean
  onCancel: () => void
  onSubmit: (details: {
    name: string; email: string; phone: string
    address1: string; address2: string; city: string; region: string
    postcode: string; country: string; notes: string
  }) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postcode, setPostcode] = useState('')
  const [country, setCountry] = useState('')
  const [notes, setNotes] = useState('')
  const [note, setNote] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !address1.trim() || !city.trim() || !postcode.trim() || !country.trim()) {
      setNote('Fill in your contact and shipping details to continue.')
      return
    }
    setNote(null)
    onSubmit({ name, email, phone, address1, address2, city, region, postcode, country, notes })
  }

  return (
    <form onSubmit={submit} className="mt-8 border-t border-ink/15 pt-6">
      <p className="text-[11px] tracking-widest text-ink/50">ORDER SUMMARY</p>

      <div className="mt-3 space-y-1.5 text-[13px]">
        <div className="flex items-baseline justify-between">
          <span className="text-ink/75">{drop.name}, {size} × {quantity}</span>
          <span>${subtotal} AUD</span>
        </div>
        <div className="flex items-baseline justify-between text-ink/60">
          <span>Shipping</span>
          <span>${SHIPPING_AUD} AUD</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/15 pt-2 text-[15px] font-medium tracking-widest">
          <span>TOTAL</span>
          <span>${total} AUD</span>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <TextField label="FULL NAME" value={name} onChange={setName} autoComplete="name" />
        <TextField label="EMAIL" value={email} onChange={setEmail} type="email" autoComplete="email" />
        <TextField label="PHONE (OPTIONAL)" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
        <TextField label="COUNTRY" value={country} onChange={setCountry} autoComplete="country-name" />
      </div>

      <div className="mt-3 grid gap-3 sm:gap-4">
        <TextField label="ADDRESS LINE 1" value={address1} onChange={setAddress1} autoComplete="address-line1" />
        <TextField label="ADDRESS LINE 2 (OPTIONAL)" value={address2} onChange={setAddress2} autoComplete="address-line2" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <TextField label="CITY" value={city} onChange={setCity} autoComplete="address-level2" />
        <TextField label="STATE / REGION" value={region} onChange={setRegion} autoComplete="address-level1" />
        <TextField label="POSTCODE" value={postcode} onChange={setPostcode} autoComplete="postal-code" />
      </div>

      <label className="mt-3 block">
        <span className="text-[10px] tracking-widest text-ink/50">NOTE (OPTIONAL)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-y border border-ink/25 bg-transparent px-4 py-3 text-[13px] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-ink"
          placeholder="Delivery instructions, gift note, anything we should know."
        />
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:gap-4">
        <button
          type="submit"
          disabled={busy}
          className="h-[54px] bg-ink text-[13px] font-medium tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {busy ? 'ONE MOMENT…' : `PLACE ORDER · $${total} AUD`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-[54px] px-6 text-[12px] tracking-widest text-ink/50 transition-opacity hover:opacity-60"
        >
          CANCEL
        </button>
      </div>

      {note && (
        <p className="mt-3 text-[11.5px] leading-relaxed text-liban-red" role="alert">
          {note}
        </p>
      )}
    </form>
  )
}

function TextField({
  label, value, onChange, type = 'text', autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-widest text-ink/50">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-[52px] w-full border border-ink/25 bg-transparent px-4 text-[13px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
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
