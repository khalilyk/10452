/**
 * Contact, behind the same seam as checkout.
 *
 * There is no server, so the form hands off rather than posting. Set an address
 * and it composes a message in the sender's own mail client, which they see and
 * send themselves — nothing is transmitted from the page.
 *
 * `address` is deliberately empty. Publishing an inbox on a public page invites
 * the obvious, and it is not mine to expose. Fill it in, or point `endpoint` at
 * a form service (Formspree and the like) and write the fetch below.
 */
export const CONTACT = {
  address: '' as string,
  endpoint: '' as string,
  instagram: '@10452.space',
  location: 'Made in Australia · Shipped worldwide',
}

export type SendResult =
  | { ok: true; via: 'mail' | 'endpoint' }
  | { ok: false; reason: 'not-configured' | 'failed' }

export interface Enquiry {
  name: string
  email: string
  message: string
}

export async function sendEnquiry(enquiry: Enquiry): Promise<SendResult> {
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
    const subject = `10452.SPACE — enquiry from ${enquiry.name || 'someone'}`
    const body = `${enquiry.message}\n\n—\n${enquiry.name}\n${enquiry.email}`
    window.location.href =
      `mailto:${CONTACT.address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return { ok: true, via: 'mail' }
  }

  return { ok: false, reason: 'not-configured' }
}
