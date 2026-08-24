import { useEffect, useState } from 'react'

/**
 * The landing state after Stripe redirects back.
 *
 * Checkout happens entirely on Stripe's hosted page, so this is the only
 * place the app finds out how it went: a query param on the return URL. Read
 * once on mount, then stripped from the address bar so a refresh doesn't
 * replay it.
 */
export function OrderStatus() {
  const [status, setStatus] = useState<'success' | 'cancelled' | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('order')
    if (order === 'success' || order === 'cancelled') {
      setStatus(order)
      params.delete('order')
      const rest = params.toString()
      window.history.replaceState({}, '', window.location.pathname + (rest ? `?${rest}` : ''))
    }
  }, [])

  if (!status) return null

  return (
    <div
      role="status"
      className={`px-5 py-4 text-center text-[12px] tracking-wide sm:px-8 ${
        status === 'success' ? 'bg-liban-green text-white' : 'bg-ink/5 text-ink/70'
      }`}
    >
      {status === 'success'
        ? "Order placed. We'll be in touch with tracking once it ships."
        : 'Checkout was cancelled. Nothing was charged.'}
    </div>
  )
}
