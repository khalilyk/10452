import Stripe from 'stripe'

/**
 * Creates a Stripe Checkout Session and hands back its URL.
 *
 * Card and Apple Pay both come from the same place: Stripe's own hosted
 * Checkout page shows Apple Pay as a one-tap option automatically on a
 * supporting browser, so there is no separate native-Apple-Pay code path
 * to build or a domain-verification file to host. One session type serves
 * both buttons on the front end.
 *
 * STRIPE_SECRET_KEY lives in Vercel's environment variables, never in this
 * repo. Until it's set, this returns "not-configured" — the same honest
 * failure the front end has always shown — rather than crashing.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'failed' })
    return
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }

  const { drop, size, quantity, name, email, phone, address1, address2, city, region, postcode, country, notes } = req.body || {}

  if (!drop || !size || !quantity || quantity < 1) {
    res.status(400).json({ ok: false, reason: 'failed' })
    return
  }

  const stripe = new Stripe(secretKey)
  const origin = req.headers.origin || `https://${req.headers.host}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: Math.round(drop.priceAud * 100),
            product_data: { name: `${drop.name} (${size})` },
          },
          quantity,
        },
        {
          price_data: {
            currency: 'aud',
            // Kept in sync by hand with SHIPPING_AUD in src/data/drops.ts —
            // this function runs isolated from the app bundle, so it can't
            // import that constant directly.
            unit_amount: 1500,
            product_data: { name: 'Shipping (worldwide flat rate)' },
          },
          quantity: 1,
        },
      ],
      // Stripe collects and validates the shipping address itself on the
      // hosted page, rather than trusting the free-text fields from our own
      // form. Ours are kept below as metadata for reference during
      // fulfillment, not as the address of record.
      shipping_address_collection: { allowed_countries: ['AU', 'US', 'GB', 'CA', 'NZ', 'LB', 'FR', 'DE'] },
      metadata: {
        dropNumber: drop.number,
        size,
        quantity: String(quantity),
        buyerName: name || '',
        buyerPhone: phone || '',
        addressAsEntered: [address1, address2, city, region, postcode, country].filter(Boolean).join(', '),
        notes: notes || '',
      },
      success_url: `${origin}/?order=success`,
      cancel_url: `${origin}/?order=cancelled`,
    })

    res.status(200).json({ ok: true, redirectUrl: session.url })
  } catch (err) {
    console.error('Stripe checkout session failed:', err)
    res.status(200).json({ ok: false, reason: 'failed' })
  }
}
