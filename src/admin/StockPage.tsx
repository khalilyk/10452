import { useEffect, useState } from 'react'
import { liveDrop, sizeAllocation } from '../data/drops.ts'
import { fetchStock } from '../lib/commerce.ts'
import { PageHeader, StatCard } from './ui.tsx'

/**
 * Real numbers, not a mock-up: the same `sizeAllocation` and `fetchStock`
 * the storefront's BuyPanel uses, so this can never show a count that
 * disagrees with what a customer sees. There is no "adjust stock" control
 * here — fetchStock() is still a stub that returns null, so a control that
 * looked like it edited stock would not actually persist anywhere. Wire
 * fetchStock to a real inventory backend first; this page will pick it up
 * automatically once you do.
 */
export function StockPage() {
  const drop = liveDrop()
  const [live, setLive] = useState<Record<string, number> | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!drop) return
    fetchStock(drop.number).then((s) => { setLive(s); setChecked(true) })
  }, [drop])

  if (!drop) {
    return (
      <div>
        <PageHeader title="STOCK TAKE" />
        <div className="p-6 text-[12px] text-ink/60">No live drop right now.</div>
      </div>
    )
  }

  const allocation = sizeAllocation(drop)
  const stock = live ?? Object.fromEntries(allocation.map((a) => [a.size, a.stock]))
  const totalStock = Object.values(stock).reduce((a, b) => a + b, 0)
  const totalAllocated = drop.edition

  return (
    <div>
      <PageHeader title="STOCK TAKE" subtitle={`DROP ${drop.number} · ${drop.name.toUpperCase()}`} />

      <div className="grid grid-cols-2 border-b-2 border-ink sm:grid-cols-3">
        <StatCard label="REMAINING" value={String(totalStock)} />
        <StatCard label="CLAIMED" value={String(totalAllocated - totalStock)} />
        <StatCard label="EDITION SIZE" value={String(totalAllocated)} />
      </div>

      {!checked && (
        <p className="border-b-2 border-ink px-6 py-3 text-[11px] tracking-widest text-ink/50">
          CHECKING LIVE STOCK…
        </p>
      )}
      {checked && live === null && (
        <p className="border-b-2 border-ink px-6 py-3 text-[11px] leading-relaxed text-ink/50">
          fetchStock() returned nothing live: showing the even 100-piece split from drops.ts instead. Wire commerce.ts to a real backend for a true stock take.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[10px] tracking-widest text-ink/50">
              <th className="px-6 py-3 font-normal">SIZE</th>
              <th className="px-6 py-3 font-normal">ALLOCATED</th>
              <th className="px-6 py-3 font-normal">REMAINING</th>
              <th className="px-6 py-3 font-normal">CLAIMED</th>
            </tr>
          </thead>
          <tbody>
            {allocation.map(({ size, stock: allocated }) => {
              const remaining = stock[size] ?? 0
              return (
                <tr key={size} className="border-b border-ink/15">
                  <td className="px-6 py-3 font-medium">{size}</td>
                  <td className="px-6 py-3 text-ink/70">{allocated}</td>
                  <td className="px-6 py-3 text-ink/70">{remaining}</td>
                  <td className="px-6 py-3 text-ink/70">{allocated - remaining}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
