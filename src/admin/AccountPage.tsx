import { useState } from 'react'
import { changePassword } from './adminApi.ts'
import { PageHeader } from './ui.tsx'

/**
 * Changing the password here updates a hash saved in the database — it does
 * not touch the ADMIN_PASSWORD environment variable, which stays as the
 * bootstrap fallback (see adminAuth.js). If the database is ever
 * unreachable, that original password still gets you back in.
 */
export function AccountPage() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (next.length < 8) {
      setMessage({ text: 'New password needs to be at least 8 characters.', isError: true })
      return
    }
    if (next !== confirm) {
      setMessage({ text: "New password and confirmation don't match.", isError: true })
      return
    }

    setBusy(true)
    const result = await changePassword(current, next)
    setBusy(false)

    if (result.ok) {
      setCurrent('')
      setNext('')
      setConfirm('')
      setMessage({ text: 'Password changed.', isError: false })
      return
    }
    setMessage({
      text: result.reason === 'wrong-password'
        ? 'Current password is wrong.'
        : result.reason === 'not-configured'
          ? "The database isn't connected, so there's nowhere to save a new password."
          : 'Something went wrong. Try again.',
      isError: true,
    })
  }

  return (
    <div>
      <PageHeader title="ACCOUNT" subtitle="CHANGE THE ADMIN PASSWORD" />

      <form onSubmit={submit} className="max-w-sm space-y-4 px-6 py-6">
        <Field label="CURRENT PASSWORD" value={current} onChange={setCurrent} />
        <Field label="NEW PASSWORD" value={next} onChange={setNext} hint="8 characters minimum" />
        <Field label="CONFIRM NEW PASSWORD" value={confirm} onChange={setConfirm} />

        <button
          type="submit"
          disabled={busy}
          className="h-[44px] w-full border-2 border-ink bg-ink text-[11px] font-bold tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {busy ? 'SAVING…' : 'CHANGE PASSWORD'}
        </button>

        {message && (
          <p className={`text-[11.5px] leading-relaxed ${message.isError ? 'text-liban-red' : 'text-ink/70'}`} role="status">
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}

function Field({
  label, value, onChange, hint,
}: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-widest text-ink/50">
        {label}
        {hint && <span className="ml-2 normal-case tracking-normal text-ink/35">{hint}</span>}
      </span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-[44px] w-full border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none"
      />
    </label>
  )
}
