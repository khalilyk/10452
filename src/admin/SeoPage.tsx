import { useEffect, useState } from 'react'
import { mergeContent, type SeoContent } from '../data/content.ts'
import { fetchAdminContent, saveAdminContentSections } from './adminApi.ts'
import { PageHeader, SaveBar, TextInput } from './ui.tsx'

/**
 * Title, description and social-card fields.
 *
 * These are injected into the actual HTML response by middleware.js at the
 * edge, not set client-side — Facebook, Twitter and most link-preview
 * crawlers don't run JavaScript, so a React component setting
 * document.title after the page loads would never be seen by them. Saving
 * here changes what those crawlers (and the browser tab) see on the very
 * next request, no redeploy.
 */
export function SeoPage() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [draft, setDraft] = useState<SeoContent | null>(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminContent().then((res) => {
      setConfigured(res.configured)
      if (res.configured) setDraft(mergeContent(res.content as never).seo)
    }).catch(() => setConfigured(false))
  }, [])

  if (configured === false) {
    return (
      <div>
        <PageHeader title="SEO" />
        <p className="max-w-md px-6 py-6 text-[12px] leading-relaxed text-ink/60">
          The database isn't connected yet, so there is nowhere to save
          edits. Copy SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the
          printparadise Vercel project into this one's environment
          variables, same as for Submissions.
        </p>
      </div>
    )
  }

  if (!draft) {
    return (
      <div>
        <PageHeader title="SEO" />
        <p className="px-6 py-6 text-[11px] tracking-widest text-ink/50">LOADING…</p>
      </div>
    )
  }

  const save = async () => {
    setBusy(true)
    setSaved(false)
    await saveAdminContentSections({ seo: draft })
    setBusy(false)
    setSaved(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="SEO" subtitle="TAB TITLE & SOCIAL PREVIEW CARDS" />

      <div className="flex-1 space-y-6 px-6 py-6">
        <TextInput label="BROWSER TAB TITLE" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <TextInput label="META DESCRIPTION" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} />
        <TextInput label="SHARE CARD TITLE" hint="og:title" value={draft.ogTitle} onChange={(v) => setDraft({ ...draft, ogTitle: v })} />
        <TextInput label="SHARE CARD DESCRIPTION" hint="og:description" value={draft.ogDescription} onChange={(v) => setDraft({ ...draft, ogDescription: v })} />
        <TextInput label="SHARE CARD IMAGE URL" hint="og:image" value={draft.ogImage} onChange={(v) => setDraft({ ...draft, ogImage: v })} />
      </div>

      <SaveBar busy={busy} saved={saved} onSave={save} />
    </div>
  )
}
