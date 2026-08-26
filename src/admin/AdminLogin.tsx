import { useState } from 'react'
import { login } from './adminApi.ts'

export function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const result = await login(password)
    setBusy(false)
    if (result.ok) { onSignedIn(); return }
    setError(result.reason === 'wrong-password' ? 'Wrong password.' : 'Something went wrong.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 font-mono">
      <form onSubmit={submit} className="w-full max-w-[22rem] border-2 border-ink">
        <div className="border-b-2 border-ink bg-ink px-5 py-3 text-center text-[12px] font-bold tracking-widest text-white">
          10452.SPACE ADMIN
        </div>

        <div className="space-y-4 p-6">
          <label className="block">
            <span className="text-[10px] tracking-widest text-ink/50">PASSWORD</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-[48px] w-full border-2 border-ink bg-transparent px-3 text-[13px] text-ink outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={busy || !password}
            className="h-[48px] w-full border-2 border-ink bg-ink text-[12px] font-bold tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {busy ? 'CHECKING…' : 'SIGN IN'}
          </button>

          {error && (
            <p className="text-[11.5px] leading-relaxed text-liban-red" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  )
}
