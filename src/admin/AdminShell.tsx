import { useEffect, useState } from 'react'
import { logout } from './adminApi.ts'
import { OverviewPage } from './OverviewPage.tsx'
import { StockPage } from './StockPage.tsx'
import { SubmissionsPage } from './SubmissionsPage.tsx'

type Section = 'overview' | 'stock' | 'submissions'

const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'stock', label: 'STOCK TAKE' },
  { id: 'submissions', label: 'SUBMISSIONS' },
]

function sectionFromHash(): Section {
  const hash = window.location.hash.replace('#', '')
  return SECTIONS.some((s) => s.id === hash) ? (hash as Section) : 'overview'
}

/**
 * Sidebar left, bordered black-on-white throughout — the same heavy-rule,
 * boxed-grid language as the brand's receipt aesthetic, just squared off
 * into a dashboard instead of a storefront.
 */
export function AdminShell({ onSignedOut }: { onSignedOut: () => void }) {
  const [section, setSection] = useState<Section>(() => sectionFromHash())

  useEffect(() => {
    const onHashChange = () => setSection(sectionFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const go = (id: Section) => { window.location.hash = id }

  const signOut = async () => {
    await logout()
    onSignedOut()
  }

  return (
    <div className="flex min-h-screen bg-cream font-mono text-ink">
      <aside className="flex w-[220px] shrink-0 flex-col border-r-2 border-ink">
        <div className="border-b-2 border-ink bg-ink px-5 py-4 text-[13px] font-bold tracking-widest text-white">
          10452.SPACE
        </div>

        <nav className="flex flex-1 flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={section === s.id ? 'page' : undefined}
              className={`border-b-2 border-ink px-5 py-4 text-left text-[11px] tracking-widest transition-colors ${
                section === s.id ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={signOut}
          className="border-t-2 border-ink px-5 py-4 text-left text-[11px] tracking-widest text-liban-red transition-colors hover:bg-ink/5"
        >
          SIGN OUT
        </button>
      </aside>

      <main className="min-w-0 flex-1">
        {section === 'overview' && <OverviewPage />}
        {section === 'stock' && <StockPage />}
        {section === 'submissions' && <SubmissionsPage />}
      </main>
    </div>
  )
}
