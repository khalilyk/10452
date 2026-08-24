/**
 * Privacy policy and terms, written for what the site actually does today.
 *
 * Plain boilerplate for a small independent shop — not a substitute for a
 * lawyer's review before real money or real customer data starts moving
 * through the site. Update the specifics (payment processor, data retention)
 * the moment commerce.ts gets wired to a real provider; a policy that
 * describes a site from six months ago is worse than none.
 */

export interface LegalSection {
  heading: string
  body: string[]
}

const UPDATED = 'August 2026'

export const PRIVACY_POLICY: { updated: string; sections: LegalSection[] } = {
  updated: UPDATED,
  sections: [
    {
      heading: 'Who we are',
      body: [
        '10452.SPACE is a Lebanon-inspired clothing project operated by Print Paradise Australia. This policy covers the information collected through 10452.space.',
      ],
    },
    {
      heading: 'What we collect',
      body: [
        'Contact form: whatever you type into the name, email and message fields. Nothing is sent to us until you press send.',
        'Orders: once ordering is live, placing one will collect your name, shipping address, email and order details, so the piece can actually reach you.',
        'We do not run any analytics or tracking scripts on this site at present, and no data is collected just from browsing it.',
      ],
    },
    {
      heading: 'How we use it',
      body: [
        'To answer what you asked, and to make, pack and ship an order if you place one. That is the whole list — nothing is used for anything else, and nothing is sold to anyone.',
      ],
    },
    {
      heading: 'Payment',
      body: [
        'Payment is handled by a third-party processor, not by us directly. We do not see or store full card numbers — the processor does, under its own security standards.',
      ],
    },
    {
      heading: 'Sharing',
      body: [
        'Shipping details are shared with the courier that gets the order to you, and nobody else. We do not sell, rent or trade personal information.',
      ],
    },
    {
      heading: 'Your rights',
      body: [
        'You can ask what we hold about you, ask us to correct it, or ask us to delete it. Message @10452.space on Instagram or use the contact form and we will sort it out directly — there is no call centre here, just us.',
      ],
    },
    {
      heading: 'Changes',
      body: [
        'If this policy changes in a way that matters, the date above will move and the change will be visible here. Small clarifications may happen without notice.',
      ],
    },
  ],
}

export const TERMS: { updated: string; sections: LegalSection[] } = {
  updated: UPDATED,
  sections: [
    {
      heading: 'Who you\'re buying from',
      body: [
        '10452.SPACE is operated by Print Paradise Australia ("we", "us"). These terms govern any purchase made through 10452.space.',
      ],
    },
    {
      heading: 'The drops',
      body: [
        'Each drop is 100 pieces, made once, never repeated. When it is gone, it is gone — there is no restock, no back-order, and no second run under a different name.',
        'Production begins once all 100 pieces of a drop are claimed. Nothing is made speculatively.',
      ],
    },
    {
      heading: 'Orders and pricing',
      body: [
        'Prices are shown in AUD at the time of order and include no hidden fees beyond the stated shipping cost. Placing an order is an offer to buy, which we accept by confirming and processing it.',
        'Stock shown on the site reflects what has actually been claimed. If a rare timing clash means an order cannot be fulfilled, you will be told and refunded in full.',
      ],
    },
    {
      heading: 'Shipping',
      body: [
        'Flat rate worldwide shipping as stated on the site. Pieces are made and dispatched from Australia; delivery times vary by destination and are outside our direct control once handed to the courier.',
      ],
    },
    {
      heading: 'Returns and faults',
      body: [
        'Because each drop is limited and made to order, we do not offer change-of-mind returns. Anything that arrives faulty or not as described is our responsibility to fix, replace or refund — nothing here overrides the consumer guarantees you are entitled to under Australian Consumer Law.',
      ],
    },
    {
      heading: 'Ownership',
      body: [
        'The 10452.SPACE name, the logomark and every drop\'s artwork belong to us. Buying a piece does not transfer any rights to reproduce the design.',
      ],
    },
    {
      heading: 'Liability',
      body: [
        'This is a small independent project, run without a large team behind it. We do our best to get every order right; to the extent the law allows, our liability for anything going wrong is limited to the price paid for the piece in question.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the laws of Australia.',
      ],
    },
    {
      heading: 'Questions',
      body: [
        'If any of this reads unclear, message @10452.space on Instagram or use the contact form. We would rather explain it plainly than have you guess.',
      ],
    },
  ],
}
