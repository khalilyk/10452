import { useContent } from '../content/ContentContext.tsx'

/** Shared bits of the admin's bordered, black-on-white frame. */

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { brand } = useContent()
  return (
    <div className="flex h-[76px] items-center justify-between gap-4 border-b-2 border-ink px-6">
      <div className="min-w-0">
        <h1 className="truncate text-[18px] font-bold tracking-widest">{title}</h1>
        {subtitle && <p className="mt-1 truncate text-[11px] tracking-widest text-ink/50">{subtitle}</p>}
      </div>
      {/* h-3/4 needs a parent with a real, fixed height to resolve against —
          the row above is h-[76px] specifically so this isn't sized against
          an "auto" flex-stretch height, which browsers treat as no height at
          all and fall back to the image's natural (huge) intrinsic size. */}
      <img src={brand.faviconUrl} alt="" aria-hidden className="h-3/4 w-auto shrink-0" />
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

export function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <span className="text-[10px] tracking-widest text-ink/50">
      {label}
      {hint && <span className="ml-2 normal-case tracking-normal text-ink/35">{hint}</span>}
    </span>
  )
}

export function TextInput({
  label, value, onChange, hint,
}: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <FieldLabel label={label} hint={hint} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-[44px] w-full border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none"
      />
    </label>
  )
}

export function NumberInput({
  label, value, onChange, hint,
}: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <label className="block">
      <FieldLabel label={label} hint={hint} />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-[44px] w-full border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none"
      />
    </label>
  )
}

export function TextAreaInput({
  label, value, onChange, rows = 4, hint,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <label className="block">
      <FieldLabel label={label} hint={hint} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y border-2 border-ink bg-transparent px-3 py-2 text-[13px] leading-relaxed text-ink outline-none"
      />
    </label>
  )
}

/** A list of strings (paragraphs, spec lines) with add/remove — no separate modal, just more rows. */
export function ListInput({
  label, values, onChange, rows = 3,
}: { label: string; values: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <div>
      <FieldLabel label={label} />
      <div className="mt-2 space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={v}
              rows={rows}
              onChange={(e) => {
                const next = [...values]
                next[i] = e.target.value
                onChange(next)
              }}
              className="w-full resize-y border-2 border-ink bg-transparent px-3 py-2 text-[13px] leading-relaxed text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              aria-label={`Remove ${label} line ${i + 1}`}
              className="w-[36px] shrink-0 border-2 border-ink text-[13px] font-bold text-liban-red transition-colors hover:bg-ink/5"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="mt-2 border-2 border-ink px-4 py-2 text-[10.5px] tracking-widest transition-colors hover:bg-ink/5"
      >
        + ADD LINE
      </button>
    </div>
  )
}

export function SaveBar({
  busy, saved, onSave,
}: { busy: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t-2 border-ink bg-cream px-6 py-4">
      <p className="text-[11px] tracking-widest text-ink/50">
        {saved ? 'SAVED' : ' '}
      </p>
      <button
        type="button"
        onClick={onSave}
        disabled={busy}
        className="h-[44px] border-2 border-ink bg-ink px-8 text-[11px] font-bold tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        {busy ? 'SAVING…' : 'SAVE CHANGES'}
      </button>
    </div>
  )
}
