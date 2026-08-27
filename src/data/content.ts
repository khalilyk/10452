import { ABOUT, DROPS, GIVING, MANIFESTO, NEXT_DROP, PRODUCTION_LINE, SHIPPING_AUD } from './drops.ts'
import type { Drop } from './drops.ts'

/**
 * The one JSON blob that makes the storefront editable from /admin.
 *
 * `DEFAULT_CONTENT` is assembled from the same values that used to be the
 * only copy of this data (drops.ts, contact.ts) — nothing changes on the
 * live site until someone actually saves an edit in the Page Editor. The
 * admin's content API merges whatever is saved in KV over these defaults, so
 * a fresh KV store (or KV not attached at all) behaves exactly like the site
 * did before this existed.
 */

export interface SeoContent {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogImage: string
}

export interface BrandContent {
  logoUrl: string
  faviconUrl: string
}

export interface ContactContent {
  instagram: string
  address: string
  endpoint: string
  location: string
}

export interface SiteContent {
  drop: Drop
  nextDrop: typeof NEXT_DROP
  about: typeof ABOUT
  giving: typeof GIVING
  manifesto: typeof MANIFESTO
  productionLine: string
  shippingAud: number
  contact: ContactContent
  seo: SeoContent
  brand: BrandContent
}

export const DEFAULT_CONTENT: SiteContent = {
  drop: DROPS[0],
  nextDrop: NEXT_DROP,
  about: ABOUT,
  giving: GIVING,
  manifesto: MANIFESTO,
  productionLine: PRODUCTION_LINE,
  shippingAud: SHIPPING_AUD,
  contact: {
    address: '',
    endpoint: '',
    instagram: '@10452.space',
    location: 'Printed in Australia · Shipped worldwide',
  },
  seo: {
    title: '10452.SPACE: DROP 001',
    description: '12 drops. 12 months. 100 pieces each. No repeats. A new piece of Lebanon every month.',
    ogTitle: "10452.SPACE, DROP 001: Mentally, I'm In Batroun",
    ogDescription: '100 pieces. No repeat. Wear your culture, everywhere.',
    ogImage: '/brand/logo.png',
  },
  brand: {
    logoUrl: '/brand/logo.png',
    faviconUrl: '/brand/favicon.png',
  },
}

/** Shallow per-top-level-key merge: a saved edit only overrides the sections it actually touched. */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  if (!saved) return DEFAULT_CONTENT
  return {
    drop: { ...DEFAULT_CONTENT.drop, ...saved.drop },
    nextDrop: { ...DEFAULT_CONTENT.nextDrop, ...saved.nextDrop },
    about: { ...DEFAULT_CONTENT.about, ...saved.about },
    giving: { ...DEFAULT_CONTENT.giving, ...saved.giving },
    manifesto: { ...DEFAULT_CONTENT.manifesto, ...saved.manifesto },
    productionLine: saved.productionLine ?? DEFAULT_CONTENT.productionLine,
    shippingAud: saved.shippingAud ?? DEFAULT_CONTENT.shippingAud,
    contact: { ...DEFAULT_CONTENT.contact, ...saved.contact },
    seo: { ...DEFAULT_CONTENT.seo, ...saved.seo },
    brand: { ...DEFAULT_CONTENT.brand, ...saved.brand },
  }
}
