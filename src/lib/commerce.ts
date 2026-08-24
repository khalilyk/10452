import type { Drop } from '../data/drops.ts'

/**
 * Checkout, deliberately behind one seam.
 *
 * Nothing here takes money yet, and that is stated rather than mimed. A button
 * that looks like it will sell a shirt and does nothing is worse than a button
 * that says it is not connected — the first loses a customer who thinks they
 * bought something, the second loses nobody.
 *
 * When a provider is chosen, only `checkout` and `fetchRemaining` need writing.
 * Everything else in the app already treats stock and orders as async facts
 * rather than constants.
 *
 * Two provider notes for whoever wires this:
 *
 *  - **Apple Pay is not a payment provider.** It is a wallet, and it needs a
 *    processor behind it (Stripe, Shopify Payments), plus domain verification
 *    with Apple and a certificate. The button below stays hidden until
 *    `applePayAvailable()` says the visitor can actually use it, because a dead
 *    Apple Pay button at checkout is the single most trust-destroying thing on
 *    a small brand's site.
 *
 *  - **The 100-piece count must come from the seller of record**, not from a
 *    number typed into the repo. If two people buy the last piece because the
 *    page was serving a stale constant, that is a refund and a broken promise.
 */

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; reason: 'not-configured' | 'sold-out' | 'failed' }

export interface Line {
  drop: Drop
  size: string
  quantity: number
}

/** Set once a provider exists. Until then the UI shows an honest disabled state. */
export const COMMERCE_CONFIGURED = false

export async function checkout(_line: Line): Promise<CheckoutResult> {
  if (!COMMERCE_CONFIGURED) return { ok: false, reason: 'not-configured' }
  // Provider call goes here — create a session, return its URL.
  return { ok: false, reason: 'failed' }
}

/**
 * Live stock. Returns null when there is no backend to ask, and the caller
 * falls back to the configured figure with the caveat shown.
 */
export async function fetchRemaining(_dropNumber: string): Promise<number | null> {
  if (!COMMERCE_CONFIGURED) return null
  return null
}

/**
 * Whether this visitor can actually pay with Apple Pay.
 *
 * Checks the browser first; the merchant side still has to be set up for it to
 * do anything. Both must be true before the button is shown at all.
 */
export function applePayAvailable(): boolean {
  if (!COMMERCE_CONFIGURED) return false
  const w = window as unknown as { ApplePaySession?: { canMakePayments(): boolean } }
  try {
    return !!w.ApplePaySession?.canMakePayments()
  } catch {
    return false
  }
}
