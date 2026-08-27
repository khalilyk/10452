import { useEffect, useMemo, useState } from 'react'
import { fetchOrders, type FullOrder } from './adminApi.ts'
import { PageHeader, StatCard, TextInput } from './ui.tsx'

const MAX_PAGES = 10 // 1,000 orders — a safety cap, not an expected ceiling for this shop.

export function OrdersPage() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [orders, setOrders] = useState<FullOrder[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [size, setSize] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      let all: FullOrder[] = []
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page++) {
        const res = await fetchOrders(cursor)
        if (cancelled) return
        if (!res.configured) { setConfigured(false); setLoading(false); return }
        all = all.concat(res.orders)
        if (!res.hasMore || !res.lastId) break
        cursor = res.lastId
      }
      if (cancelled) return
      setOrders(all)
      setConfigured(true)
      setLoading(false)
    }
    loadAll().catch(() => {
      if (!cancelled) { setConfigured(false); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [])

  const sizes = useMemo(() => Array.from(new Set(orders.map((o) => o.size).filter(Boolean))), [orders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (size && o.size !== size) return false
      if (from && o.createdAt < from) return false
      if (to && o.createdAt > `${to}T23:59:59`) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = `${o.name} ${o.email}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [orders, size, from, to, search])

  const totalAud = filtered.reduce((sum, o) => sum + o.amountAud, 0)

  const downloadCsv = () => {
    const headers = [
      'Date', 'Name', 'Email', 'Phone', 'Drop', 'Size', 'Qty', 'Amount', 'Currency',
      'Address line 1', 'Address line 2', 'City', 'Region', 'Postcode', 'Country', 'Notes',
    ]
    const rows = filtered.map((o) => [
      o.createdAt, o.name, o.email, o.phone, o.dropNumber, o.size, o.quantity,
      o.amountAud.toFixed(2), o.currency,
      o.address?.line1 || '', o.address?.line2 || '', o.address?.city || '',
      o.address?.region || '', o.address?.postcode || '', o.address?.country || '',
      o.notes,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(','))
      .join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (configured === false) {
    return (
      <div>
        <PageHeader title="ORDERS" />
        <p className="max-w-md px-6 py-6 text-[12px] leading-relaxed text-ink/60">
          Checkout is not connected to Stripe yet, so there are no orders to
          show. Set STRIPE_SECRET_KEY in Vercel: the same key that turns on
          ORDER NOW and Apple Pay on the storefront.
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="ORDERS" subtitle={loading ? 'LOADING…' : `${orders.length} PAID ORDER${orders.length === 1 ? '' : 'S'}`} />

      <div className="grid grid-cols-2 border-b-2 border-ink sm:grid-cols-3">
        <StatCard label="SHOWN" value={String(filtered.length)} />
        <StatCard label="TOTAL (FILTERED)" value={`$${totalAud.toFixed(0)} AUD`} />
      </div>

      <div className="grid gap-3 border-b-2 border-ink px-6 py-4 sm:grid-cols-[1fr_auto_auto_auto_auto]">
        <TextInput label="SEARCH" hint="name or email" value={search} onChange={setSearch} />
        <label className="block">
          <span className="text-[10px] tracking-widest text-ink/50">SIZE</span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-2 h-[44px] w-full border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none sm:w-[120px]"
          >
            <option value="">ALL</option>
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] tracking-widest text-ink/50">FROM</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 h-[44px] border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-widest text-ink/50">TO</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 h-[44px] border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none" />
        </label>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={filtered.length === 0}
          className="mt-auto h-[44px] border-2 border-ink bg-ink px-5 text-[11px] font-bold tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          DOWNLOAD CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse whitespace-nowrap text-[12px]">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[10px] tracking-widest text-ink/50">
              <th className="px-4 py-3 font-normal">DATE</th>
              <th className="px-4 py-3 font-normal">NAME</th>
              <th className="px-4 py-3 font-normal">EMAIL</th>
              <th className="px-4 py-3 font-normal">PHONE</th>
              <th className="px-4 py-3 font-normal">SIZE</th>
              <th className="px-4 py-3 font-normal">QTY</th>
              <th className="px-4 py-3 font-normal">AMOUNT</th>
              <th className="px-4 py-3 font-normal">LOCATION</th>
              <th className="px-4 py-3 font-normal">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-ink/15">
                <td className="px-4 py-3 text-ink/70">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{o.name || '-'}</td>
                <td className="px-4 py-3 text-ink/70">{o.email || '-'}</td>
                <td className="px-4 py-3 text-ink/70">{o.phone || '-'}</td>
                <td className="px-4 py-3">{o.size || '-'}</td>
                <td className="px-4 py-3">{o.quantity || '-'}</td>
                <td className="px-4 py-3">${o.amountAud.toFixed(2)} {o.currency}</td>
                <td className="px-4 py-3 text-ink/70">
                  {o.address ? [o.address.city, o.address.region, o.address.country].filter(Boolean).join(', ') || '-' : '-'}
                </td>
                <td className="max-w-[16rem] truncate px-4 py-3 text-ink/70" title={o.notes}>{o.notes || '-'}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-ink/50">No orders match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function csvCell(value: string) {
  const s = String(value ?? '')
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
