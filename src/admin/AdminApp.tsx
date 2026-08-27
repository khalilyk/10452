import { useEffect, useState } from 'react'
import { fetchSession } from './adminApi.ts'
import { AdminLogin } from './AdminLogin.tsx'
import { AdminShell } from './AdminShell.tsx'
import { ContentProvider } from '../content/ContentContext.tsx'

type Status = 'checking' | 'not-configured' | 'signed-out' | 'signed-in'

export function AdminApp() {
  const [status, setStatus] = useState<Status>('checking')

  const checkSession = async () => {
    try {
      const session = await fetchSession()
      setStatus(!session.configured ? 'not-configured' : session.authed ? 'signed-in' : 'signed-out')
    } catch {
      // No /api routes in local `vite dev` — only Vercel actually runs them.
      setStatus('not-configured')
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  if (status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream font-mono text-[12px] tracking-widest text-ink/50">
        LOADING…
      </main>
    )
  }

  if (status === 'not-configured') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center font-mono">
        <p className="text-[13px] tracking-widest">ADMIN NOT CONFIGURED</p>
        <p className="max-w-sm text-[12px] leading-relaxed text-ink/60">
          Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the Vercel project's
          environment variables to enable this panel.
        </p>
      </main>
    )
  }

  if (status === 'signed-out') {
    return <AdminLogin onSignedIn={checkSession} />
  }

  return (
    <ContentProvider>
      <AdminShell onSignedOut={() => setStatus('signed-out')} />
    </ContentProvider>
  )
}
