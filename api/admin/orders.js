import Stripe from 'stripe'
import { requireSession } from '../_lib/adminAuth.js'

/**
 * Every paid order, read straight from Stripe — same reasoning as
 * overview.js: Stripe is already the record of truth for what was paid, so
 * there's no second copy of order data to keep in sync.
 *
 * Pulls up to 100 at a time with `starting_after` cursor pagination (Stripe's
 * own scheme), rather than trying to fetch "everything" in one call — a shop
 * with a few thousand orders would time this function out otherwise.
 */
export default requireSession(async (req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    res.status(200).json({ configured: false, orders: [], hasMore: false })
    return
  }

  const stripe = new Stripe(secretKey)
  const startingAfter = req.query?.startingAfter || undefined

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      starting_after: startingAfter,
    })

    const orders = sessions.data
      .filter((s) => s.payment_status === 'paid')
      .map((s) => {
        const shipping = s.shipping_details?.address || s.customer_details?.address || null
        return {
          id: s.id,
          createdAt: new Date(s.created * 1000).toISOString(),
          amountAud: (s.amount_total || 0) / 100,
          currency: (s.currency || 'aud').toUpperCase(),
          email: s.customer_details?.email || s.customer_email || '',
          name: s.shipping_details?.name || s.customer_details?.name || s.metadata?.buyerName || '',
          phone: s.customer_details?.phone || s.metadata?.buyerPhone || '',
          dropNumber: s.metadata?.dropNumber || '',
          size: s.metadata?.size || '',
          quantity: s.metadata?.quantity || '',
          notes: s.metadata?.notes || '',
          address: shipping ? {
            line1: shipping.line1 || '',
            line2: shipping.line2 || '',
            city: shipping.city || '',
            region: shipping.state || '',
            postcode: shipping.postal_code || '',
            country: shipping.country || '',
          } : null,
        }
      })

    res.status(200).json({
      configured: true,
      orders,
      hasMore: sessions.has_more,
      lastId: sessions.data.length ? sessions.data[sessions.data.length - 1].id : null,
    })
  } catch (err) {
    console.error('Fetching orders failed:', err)
    res.status(500).json({ configured: true, orders: [], hasMore: false, error: true })
  }
})
