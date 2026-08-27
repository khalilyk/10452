import { useEffect, useState } from 'react'
import { mergeContent, type SiteContent } from '../data/content.ts'
import { fetchAdminContent, saveAdminContentSections } from './adminApi.ts'
import { ListInput, NumberInput, PageHeader, SaveBar, TextAreaInput, TextInput } from './ui.tsx'

/**
 * Everything a visitor reads, in one editable form.
 *
 * Loads the effective values (defaults merged with whatever's saved), not
 * the raw saved record. Editing should never start from a blank field just
 * because that particular line hasn't been touched from admin yet.
 */
export function ContentPage() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminContent().then((res) => {
      setConfigured(res.configured)
      if (res.configured) setDraft(mergeContent(res.content as Partial<SiteContent> | null))
    }).catch(() => setConfigured(false))
  }, [])

  if (configured === false) {
    return (
      <div>
        <PageHeader title="PAGE EDITOR" />
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
        <PageHeader title="PAGE EDITOR" />
        <p className="px-6 py-6 text-[11px] tracking-widest text-ink/50">LOADING…</p>
      </div>
    )
  }

  const save = async () => {
    setBusy(true)
    setSaved(false)
    await saveAdminContentSections({
      drop: draft.drop,
      nextDrop: draft.nextDrop,
      about: draft.about,
      giving: draft.giving,
      manifesto: draft.manifesto,
      productionLine: draft.productionLine,
      shippingAud: draft.shippingAud,
      contact: draft.contact,
    })
    setBusy(false)
    setSaved(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="PAGE EDITOR" subtitle="EVERY EDIT HERE GOES LIVE ON SAVE, NO REDEPLOY" />

      <div className="flex-1 space-y-10 px-6 py-6">
        <Section title="THE DROP">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="NAME" value={draft.drop.name} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, name: v } })} />
            <TextInput label="LOCATION" value={draft.drop.location} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, location: v } })} />
            <NumberInput label="PRICE (AUD)" value={draft.drop.priceAud} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, priceAud: v } })} />
            <NumberInput label="EDITION SIZE" value={draft.drop.edition} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, edition: v } })} />
            <TextInput label="RELEASED AT" hint="YYYY-MM-DD" value={draft.drop.releasedAt} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, releasedAt: v } })} />
            <TextInput label="SIZES" hint="comma separated" value={draft.drop.sizes.join(', ')} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, sizes: v.split(',').map((s) => s.trim()).filter(Boolean) } })} />
          </div>
          <div className="mt-4">
            <ListInput label="STORY PARAGRAPHS" values={draft.drop.story} onChange={(v) => setDraft({ ...draft, drop: { ...draft.drop, story: v } })} />
          </div>
        </Section>

        <Section title="NEXT CHAPTER TEASER">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="DROP NUMBER" value={draft.nextDrop.number} onChange={(v) => setDraft({ ...draft, nextDrop: { ...draft.nextDrop, number: v } })} />
            <TextInput label="REVEALS AT" value={draft.nextDrop.revealsAt} onChange={(v) => setDraft({ ...draft, nextDrop: { ...draft.nextDrop, revealsAt: v } })} />
          </div>
          <div className="mt-4">
            <TextAreaInput label="TEASER TEXT" value={draft.nextDrop.teaser} onChange={(v) => setDraft({ ...draft, nextDrop: { ...draft.nextDrop, teaser: v } })} />
          </div>
        </Section>

        <Section title="ABOUT">
          <TextInput label="HEADING" value={draft.about.heading} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, heading: v } })} />
          <div className="mt-4">
            <ListInput label="BODY PARAGRAPHS" values={draft.about.body} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, body: v } })} />
          </div>
          <div className="mt-4">
            <TextInput label="IMAGE CAPTION" value={draft.about.imageCaption} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, imageCaption: v } })} />
          </div>
        </Section>

        <Section title="GIVING BACK">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="AMOUNT" hint="e.g. $5" value={draft.giving.amount} onChange={(v) => setDraft({ ...draft, giving: { ...draft.giving, amount: v } })} />
            <TextInput label="CHARITY NAME" value={draft.giving.charity} onChange={(v) => setDraft({ ...draft, giving: { ...draft.giving, charity: v } })} />
            <TextInput label="CHARITY URL" value={draft.giving.charityUrl} onChange={(v) => setDraft({ ...draft, giving: { ...draft.giving, charityUrl: v } })} />
          </div>
          <div className="mt-4">
            <TextAreaInput label="CHARITY BLURB" value={draft.giving.charityBlurb} onChange={(v) => setDraft({ ...draft, giving: { ...draft.giving, charityBlurb: v } })} rows={2} />
          </div>
        </Section>

        <Section title="SHIPPING & PRODUCTION">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="SHIPPING (AUD)" value={draft.shippingAud} onChange={(v) => setDraft({ ...draft, shippingAud: v })} />
          </div>
          <div className="mt-4">
            <TextAreaInput label="PRODUCTION PROMISE" hint="the scrolling marquee line" value={draft.productionLine} onChange={(v) => setDraft({ ...draft, productionLine: v })} rows={2} />
          </div>
        </Section>

        <Section title="MANIFESTO">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="DROPS" value={draft.manifesto.drops} onChange={(v) => setDraft({ ...draft, manifesto: { ...draft.manifesto, drops: v } })} />
            <NumberInput label="PIECES PER DROP" value={draft.manifesto.pieces} onChange={(v) => setDraft({ ...draft, manifesto: { ...draft.manifesto, pieces: v } })} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextInput label="LINE" hint="between-drops headline" value={draft.manifesto.line} onChange={(v) => setDraft({ ...draft, manifesto: { ...draft.manifesto, line: v } })} />
            <TextInput label="SUB" value={draft.manifesto.sub} onChange={(v) => setDraft({ ...draft, manifesto: { ...draft.manifesto, sub: v } })} />
          </div>
        </Section>

        <Section title="CONTACT">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="INSTAGRAM" hint="with @" value={draft.contact.instagram} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, instagram: v } })} />
            <TextInput label="LOCATION LINE" value={draft.contact.location} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, location: v } })} />
            <TextInput label="EMAIL ADDRESS" hint="leave blank to hide" value={draft.contact.address} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, address: v } })} />
            <TextInput label="FORM ENDPOINT" hint="e.g. Formspree URL, optional" value={draft.contact.endpoint} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, endpoint: v } })} />
          </div>
        </Section>
      </div>

      <SaveBar busy={busy} saved={saved} onSave={save} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 border-b-2 border-ink pb-2 text-[13px] font-bold tracking-widest">{title}</h2>
      {children}
    </div>
  )
}
