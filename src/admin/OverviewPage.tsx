import { useEffect, useState } from 'react'
import { fetchOverview, type OverviewData } from './adminApi.ts'
import { PageHeader, StatCard } from './ui.tsx'

export function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null)

  useEffect(() => {
    fetchOverview().then(setData).catch(() => setData({ configured: false }))
  }, [])

  return (
    <div>
      <PageHeader title="OVERVIEW" subtitle="ANALYTICS & SALES" />

      {!data && (
        <p className="px-6 py-6 text-[11px] tracking-widest text-ink/50">LOADING…</p>
      )}

      {data && !data.configured && (
        <div className="px-6 py-6">
          <p className="max-w-md text-[12px] leading-relaxed text-ink/60">
            Checkout is not connected to Stripe yet, so there is nothing to
            report. Set STRIPE_SECRET_KEY in Vercel to see real revenue and
            orders here: the same key that turns on ORDER NOW and Apple Pay
            on the storefront.
          </p>
        </div>
      )}

      {data?.configured && data.error && (
        <p className="px-6 py-6 text-[12px] text-liban-red">
          Stripe didn't respond. Try reloading.
        </p>
      )}

      {data?.configured && !data.error && (
        <>
          <div className="grid grid-cols-2 border-b-2 border-ink sm:grid-cols-2">
            <StatCard label="REVENUE (LAST 50 SESSIONS)" value={`$${(data.revenueAud ?? 0).toFixed(0)} AUD`} />
            <StatCard label="PAID ORDERS" value={String(data.orderCount ?? 0)} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b-2 border-ink text-left text-[10px] tracking-widest text-ink/50">
                  <th className="px-6 py-3 font-normal">DATE</th>
                  <th className="px-6 py-3 font-normal">EMAIL</th>
                  <th className="px-6 py-3 font-normal">SIZE</th>
                  <th className="px-6 py-3 font-normal">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {(data.orders ?? []).map((o) => (
                  <tr key={o.id} className="border-b border-ink/15">
                    <td className="px-6 py-3 text-ink/70">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-3 text-ink/70">{o.email || '-'}</td>
                    <td className="px-6 py-3 text-ink/70">{o.size || '-'}</td>
                    <td className="px-6 py-3">${o.amountAud.toFixed(2)} AUD</td>
                  </tr>
                ))}
                {(data.orders ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-ink/50">No paid orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
