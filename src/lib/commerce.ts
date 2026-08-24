import type { Drop } from '../data/drops.ts'

/**
 * Checkout, behind one seam.
 *
 * `checkout` posts to /api/checkout, a Vercel serverless function that
 * creates a Stripe Checkout Session and hands back its URL. Card and Apple
 * Pay both come from that one session: Stripe's hosted page shows Apple Pay
 * as a one-tap option automatically on a supporting browser, so there is no
 * separate native-Apple-Pay button to build or domain file to host.
 *
 * The endpoint itself returns `{ ok: false, reason: 'not-configured' }` when
 * STRIPE_SECRET_KEY isn't set on Vercel, so the front end keeps its honest
 * failure message with no code changes needed once a real key is added.
 *
 * **The 100-piece count must come from the seller of record**, not from a
 * number typed into the repo. If two people buy the last piece because the
 * page was serving a stale constant, that is a refund and a broken promise.
 * See `fetchStock` below.
 */

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; reason: 'not-configured' | 'sold-out' | 'failed' }

export interface Line {
  drop: Drop
  size: string
  quantity: number
  name: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  region: string
  postcode: string
  country: string
  notes: string
}

export async function checkout(line: Line): Promise<CheckoutResult> {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(line),
    })
    if (!res.ok) return { ok: false, reason: 'failed' }
    return await res.json()
  } catch {
    return { ok: false, reason: 'failed' }
  }
}

/**
 * Live stock, per size. Returns null when there is no backend to ask, and the
 * caller falls back to the even split of the edition.
 *
 * Per size rather than a single total on purpose: the total is the sum, but the
 * reverse does not hold, and the select has to know which sizes are gone. A
 * provider that only reports a total cannot answer "is there an M left".
 *
 * Stripe has no concept of per-size inventory, so this is still a stub. Wire
 * it to whatever tracks stock once orders are actually coming in through
 * checkout — a spreadsheet, Stripe metadata read back out, or a real store.
 */
export async function fetchStock(_dropNumber: string): Promise<Record<string, number> | null> {
  return null
}
