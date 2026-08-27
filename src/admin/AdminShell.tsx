import { useEffect, useState } from 'react'
import { logout } from './adminApi.ts'
import { OverviewPage } from './OverviewPage.tsx'
import { StockPage } from './StockPage.tsx'
import { OrdersPage } from './OrdersPage.tsx'
import { SubmissionsPage } from './SubmissionsPage.tsx'
import { ContentPage } from './ContentPage.tsx'
import { MediaLibraryPage } from './MediaLibraryPage.tsx'
import { SeoPage } from './SeoPage.tsx'
import { AccountPage } from './AccountPage.tsx'
import { useContent } from '../content/ContentContext.tsx'

type Section = 'overview' | 'orders' | 'stock' | 'submissions' | 'content' | 'media' | 'seo' | 'account'

const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'orders', label: 'ORDERS' },
  { id: 'stock', label: 'STOCK TAKE' },
  { id: 'submissions', label: 'SUBMISSIONS' },
  { id: 'content', label: 'PAGE EDITOR' },
  { id: 'media', label: 'MEDIA LIBRARY' },
  { id: 'seo', label: 'SEO' },
]

// Not in the main nav list — its button lives in the sidebar footer, above
// Sign Out, since it's account housekeeping rather than a content section.
const ACCOUNT_SECTION: Section = 'account'

function sectionFromHash(): Section {
  const hash = window.location.hash.replace('#', '')
  if (hash === ACCOUNT_SECTION) return ACCOUNT_SECTION
  return SECTIONS.some((s) => s.id === hash) ? (hash as Section) : 'overview'
}

/**
 * Sidebar left, bordered black-on-white throughout — the same heavy-rule,
 * boxed-grid language as the brand's receipt aesthetic, just squared off
 * into a dashboard instead of a storefront.
 */
export function AdminShell({ onSignedOut }: { onSignedOut: () => void }) {
  const { brand } = useContent()
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
        <div className="flex items-center justify-center border-b-2 border-ink bg-ink px-5 py-6">
          {/* The brand mark is a black PNG, so it's inverted to white here
              rather than shipping a second light-mode asset. */}
          <img src={brand.logoUrl} alt="10452.SPACE" className="w-3/4 invert" />
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
          onClick={() => go(ACCOUNT_SECTION)}
          aria-current={section === ACCOUNT_SECTION ? 'page' : undefined}
          className={`border-t-2 border-ink px-5 py-4 text-left text-[11px] tracking-widest transition-colors ${
            section === ACCOUNT_SECTION ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/5'
          }`}
        >
          ACCOUNT
        </button>

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
        {section === 'orders' && <OrdersPage />}
        {section === 'stock' && <StockPage />}
        {section === 'submissions' && <SubmissionsPage />}
        {section === 'content' && <ContentPage />}
        {section === 'media' && <MediaLibraryPage />}
        {section === 'seo' && <SeoPage />}
        {section === 'account' && <AccountPage />}
      </main>
    </div>
  )
}
