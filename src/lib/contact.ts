/**
 * Contact, behind the same seam as checkout.
 *
 * Three ways this can actually reach someone, tried in order:
 *
 *  1. `/api/submit` — stores the message in Vercel KV, where it shows up in
 *     /admin's Submissions tab. This is the one that "just works" once a KV
 *     store is attached to the Vercel project; nothing else to configure.
 *  2. `endpoint` — a form service like Formspree, if you'd rather it land in
 *     an inbox than in the admin panel.
 *  3. `address` — composes a message in the visitor's own mail client, which
 *     they see and send themselves. Deliberately empty by default:
 *     publishing an inbox on a public page invites the obvious, and it is
 *     not mine to expose.
 *
 * If none of the three are configured, the form says so rather than
 * pretending to have sent something into the void.
 */
export const CONTACT = {
  address: '' as string,
  endpoint: '' as string,
  instagram: '@10452.space',
  location: 'Printed in Australia · Shipped worldwide',
}

export type SendResult =
  | { ok: true; via: 'store' | 'endpoint' | 'mail' }
  | { ok: false; reason: 'not-configured' | 'failed' }

export interface Enquiry {
  name: string
  email: string
  message: string
}

export async function sendEnquiry(enquiry: Enquiry): Promise<SendResult> {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    })
    const body = await res.json().catch(() => null)
    if (body?.ok) return { ok: true, via: 'store' }
  } catch {
    // Falls through to endpoint/mail below.
  }

  if (CONTACT.endpoint) {
    try {
      const res = await fetch(CONTACT.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      })
      return res.ok ? { ok: true, via: 'endpoint' } : { ok: false, reason: 'failed' }
    } catch {
      return { ok: false, reason: 'failed' }
    }
  }

  if (CONTACT.address) {
    const subject = `10452.SPACE: enquiry from ${enquiry.name || 'someone'}`
    const body = `${enquiry.message}\n\n-\n${enquiry.name}\n${enquiry.email}`
    window.location.href =
      `mailto:${CONTACT.address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return { ok: true, via: 'mail' }
  }

  return { ok: false, reason: 'not-configured' }
}
