import { useState } from 'react'
import { CONTACT, sendEnquiry } from '../lib/contact.ts'

/**
 * Details left, form right on black.
 *
 * The black half carries straight on from the shipping band above it, so the
 * page ends on one continuous dark block rather than alternating twice more.
 */
export function Contact() {
  return (
    <section id="contact" className="grid lg:grid-cols-2" aria-labelledby="contact-heading">
      <div className="flex flex-col justify-center bg-cream px-5 py-14 sm:px-8 sm:py-20 lg:py-24 lg:pl-16 lg:pr-14">
        <p className="text-[10.5px] tracking-widest text-ink/45">CONTACT</p>

        <h2
          id="contact-heading"
          className="mt-3 max-w-[34rem] text-[24px] font-medium leading-[1.25] tracking-[0.06em] sm:text-[30px]"
        >
          SAY SOMETHING
        </h2>

        <p className="mt-5 max-w-[30rem] text-[13px] leading-[1.95] text-ink/75">
          Questions about a drop, sizing, an order, or an idea for a future
          chapter. If you know a reference we should be making, tell us — half of
          this project comes from other people's memories.
        </p>

        <dl className="mt-9 max-w-[34rem] space-y-3.5 border-t border-ink/15 pt-5 text-[12.5px]">
          <Row label="INSTAGRAM">
            <a
              href={`https://instagram.com/${CONTACT.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {CONTACT.instagram}
            </a>
          </Row>
          <Row label="EMAIL">
            {CONTACT.address ? (
              <a
                href={`mailto:${CONTACT.address}`}
                className="underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                {CONTACT.address}
              </a>
            ) : (
              <span className="text-ink/45">Not published yet</span>
            )}
          </Row>
          <Row label="SHIPPING">{CONTACT.location}</Row>
        </dl>
      </div>

      <ContactForm />
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="shrink-0 text-[10px] tracking-widest text-ink/45">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNote(null)

    if (!message.trim()) { setNote('Write a message first.'); return }
    setBusy(true)
    const result = await sendEnquiry({ name, email, message })
    setBusy(false)

    if (result.ok) {
      setSent(true)
      setNote(
        result.via === 'mail'
          ? 'Opening your mail app — send it from there and it reaches us.'
          : 'Sent. We will come back to you.',
      )
      return
    }
    setNote(
      result.reason === 'not-configured'
        // Said plainly. A form that swallows a message and thanks you for it is
        // worse than one that admits it has nowhere to send it.
        ? 'No inbox is connected yet, so this cannot be sent. Reach us on Instagram in the meantime.'
        : 'That did not go through. Try again, or reach us on Instagram.',
    )
  }

  return (
    <form onSubmit={submit} className="bg-ink px-5 py-14 sm:px-8 sm:py-20 lg:py-24 lg:px-14">
      <div className="mx-auto max-w-[30rem] space-y-4">
        <Field label="NAME" value={name} onChange={setName} autoComplete="name" />
        <Field label="EMAIL" value={email} onChange={setEmail} type="email" autoComplete="email" />

        <label className="block">
          <span className="text-[10px] tracking-widest text-white/50">MESSAGE</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="mt-2 w-full resize-y border border-white/25 bg-transparent px-4 py-3 text-[13px] leading-relaxed text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
            placeholder="Tell us what you're thinking."
          />
        </label>

        <button
          type="submit"
          disabled={busy || sent}
          className="h-[54px] w-full bg-white text-[13px] font-medium tracking-widest text-ink transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {sent ? 'SENT' : busy ? 'ONE MOMENT…' : 'SEND'}
        </button>

        {note && (
          <p className="text-[11.5px] leading-relaxed text-white/70" role="status">
            {note}
          </p>
        )}
      </div>
    </form>
  )
}

function Field({
  label, value, onChange, type = 'text', autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-widest text-white/50">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-[52px] w-full border border-white/25 bg-transparent px-4 text-[13px] text-white outline-none transition-colors focus:border-white"
      />
    </label>
  )
}
