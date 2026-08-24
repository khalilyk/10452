/**
 * The drops.
 *
 * One release a month, 100 pieces, no repeats. Each drop is a chapter, so the
 * homepage is simply whichever one is `live` — there is no catalogue, and the
 * archive is everything with status `sold-out`.
 *
 * On `remaining`: this number is the whole proposition. "37/100 LEFT" printed on
 * a page that never counts down is a lie told to a customer, and it is the one
 * lie this brand cannot afford, because scarcity is the product. It is typed
 * here so the page can be built and reviewed, and it MUST be read from whatever
 * takes the orders before this goes live. See src/lib/commerce.ts.
 */

export type DropStatus = 'upcoming' | 'live' | 'sold-out'

export interface Drop {
  /** 001, 002 … used in the URL and the archive. */
  number: string
  name: string
  /** Short line under the campaign image, if any. */
  tagline?: string
  status: DropStatus
  /** Total ever made. Never more than this, never again. */
  edition: number
  /** Pieces left. Placeholder until the commerce backend supplies it. */
  remaining: number
  priceAud: number
  /** Where the campaign was shot — the brief ties each drop to a place. */
  location: string
  /** Paragraphs of the drop story, in order. */
  story: string[]
  spec: string[]
  sizes: string[]
  /** Campaign photograph. Null until the shoot lands. */
  image: string | null
  /** The artwork itself, shown in the archive and on the product. */
  artwork: string | null
  releasedAt: string
}

export const DROPS: Drop[] = [
  {
    number: '001',
    name: 'Receipt Tee',
    tagline: 'Hungry habibi?',
    status: 'live',
    edition: 100,
    remaining: 100,
    priceAud: 89,
    location: 'Batroun, Lebanon',
    story: [
      '10452.Space is inspired by Lebanon. 10452 is the area code. This tee is a tribute to our roots, our culture and the everyday pride that comes with it.',
      "Made in Australia. 100% Premium Cotton. 260 GSM. Built to last. Limited drop. Once it's gone, it's gone.",
      'Wear your culture. Everywhere.',
    ],
    spec: [
      'Made in Australia',
      '100% premium cotton, 260 GSM',
      'Oversized, relaxed fit',
      'Back graphic, screen printed',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: null,
    artwork: null,
    releasedAt: '2026-09-01',
  },
]

export const liveDrop = (): Drop | undefined => DROPS.find((d) => d.status === 'live')
export const archive = (): Drop[] => DROPS.filter((d) => d.status === 'sold-out')

/** "12 DROPS. 12 MONTHS. 100 PIECES EACH. NO REPEATS." */
export const MANIFESTO = {
  drops: 12,
  months: 12,
  pieces: 100,
  line: '12 DROPS. 12 MONTHS. 100 PIECES EACH. NO REPEATS.',
  sub: 'A new piece of Lebanon every month.',
}

export const SHIPPING = '$15 SHIPPING WORLDWIDE'

/** The made-to-order promise, run as a band under the product. */
export const PRODUCTION_LINE =
  'Production begins once all 100 pieces are claimed. No overproduction. No repeats.'

/**
 * The about copy, condensed from the brief.
 *
 * Kept here rather than in the component so it can be edited without touching
 * layout — this is the paragraph most likely to be rewritten as the brand finds
 * its voice.
 */
export const ABOUT = {
  heading: 'A NEW PIECE OF LEBANON, EVERY MONTH',
  body: [
    '10452.SPACE is a limited-edition Lebanese project built around culture, nostalgia, humour and the everyday things that instantly feel like home. The name is Lebanon’s international dialling code — something every Lebanese person abroad already knows by heart.',
    'This is not souvenir merchandise. Each drop takes one piece of Lebanese life — a plastic chair, a late-night table, a taxi, a balcony, an expression, a packet you grew up with — and reinterprets it. Designs should stand up on their own; if you know the reference, you get something extra.',
    'Nothing is made until all 100 pieces are sold, so nothing is wasted. Once a drop is gone it enters the archive and we move on to the next chapter.',
  ],
  /** Portrait or still life. Null until the shoot lands. */
  image: null as string | null,
  imageCaption: 'Batroun, Lebanon',
}
