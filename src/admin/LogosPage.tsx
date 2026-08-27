import { useEffect, useState } from 'react'
import { mergeContent, type BrandContent } from '../data/content.ts'
import { fetchAdminContent, saveAdminContentSections } from './adminApi.ts'
import { PageHeader, SaveBar, TextInput } from './ui.tsx'

/**
 * Logo and favicon, as URLs rather than an upload widget — for now those
 * URLs point at files already in public/brand/. Once the media library
 * exists this is where a picker replaces the text field; the content model
 * doesn't change either way, only how the URL gets into it.
 */
export function LogosPage() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [draft, setDraft] = useState<BrandContent | null>(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminContent().then((res) => {
      setConfigured(res.configured)
      if (res.configured) setDraft(mergeContent(res.content as never).brand)
    })
  }, [])

  if (configured === false) {
    return (
      <div>
        <PageHeader title="LOGOS" />
        <p className="max-w-md px-6 py-6 text-[12px] leading-relaxed text-ink/60">
          No KV store is attached, so there is nowhere to save edits.
        </p>
      </div>
    )
  }

  if (!draft) {
    return (
      <div>
        <PageHeader title="LOGOS" />
        <p className="px-6 py-6 text-[11px] tracking-widest text-ink/50">LOADING…</p>
      </div>
    )
  }

  const save = async () => {
    setBusy(true)
    setSaved(false)
    await saveAdminContentSections({ brand: draft })
    setBusy(false)
    setSaved(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="LOGOS" subtitle="HEADER MARK & BROWSER FAVICON" />

      <div className="flex-1 space-y-8 px-6 py-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <TextInput label="LOGO URL" value={draft.logoUrl} onChange={(v) => setDraft({ ...draft, logoUrl: v })} />
            <Preview src={draft.logoUrl} />
          </div>
          <div>
            <TextInput label="FAVICON URL" value={draft.faviconUrl} onChange={(v) => setDraft({ ...draft, faviconUrl: v })} />
            <Preview src={draft.faviconUrl} />
          </div>
        </div>
      </div>

      <SaveBar busy={busy} saved={saved} onSave={save} />
    </div>
  )
}

function Preview({ src }: { src: string }) {
  return (
    <div className="mt-3 flex h-32 items-center justify-center border-2 border-ink bg-white">
      {src ? <img src={src} alt="" className="max-h-24 max-w-[80%] object-contain" /> : (
        <span className="text-[10px] tracking-widest text-ink/40">NO IMAGE</span>
      )}
    </div>
  )
}
