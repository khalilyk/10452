/** Shared bits of the admin's bordered, black-on-white frame. */

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b-2 border-ink px-6 py-5">
      <h1 className="text-[18px] font-bold tracking-widest">{title}</h1>
      {subtitle && <p className="mt-1 text-[11px] tracking-widest text-ink/50">{subtitle}</p>}
    </div>
  )
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r-2 border-ink px-6 py-6 last:border-r-0">
      <p className="text-[26px] font-bold leading-none">{value}</p>
      <p className="mt-2 text-[10px] tracking-widest text-ink/50">{label}</p>
    </div>
  )
}
