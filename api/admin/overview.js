import Stripe from 'stripe'
import { requireSession } from '../_lib/adminAuth.js'

/**
 * Sales figures, read straight from Stripe rather than kept in a database of
 * our own — Stripe is already the source of truth for every order that ever
 * completed, so a second copy would only be a second place for it to drift.
 */
export default requireSession(async (req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    res.status(200).json({ configured: false })
    return
  }

  const stripe = new Stripe(secretKey)

  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 50 })
    const paid = sessions.data.filter((s) => s.payment_status === 'paid')

    const revenueCents = paid.reduce((sum, s) => sum + (s.amount_total || 0), 0)
    const orders = paid
      .sort((a, b) => b.created - a.created)
      .slice(0, 20)
      .map((s) => ({
        id: s.id,
        createdAt: new Date(s.created * 1000).toISOString(),
        amountAud: (s.amount_total || 0) / 100,
        email: s.customer_details?.email || s.customer_email || '',
        size: s.metadata?.size || '',
        dropNumber: s.metadata?.dropNumber || '',
      }))

    res.status(200).json({
      configured: true,
      revenueAud: revenueCents / 100,
      orderCount: paid.length,
      orders,
    })
  } catch (err) {
    console.error('Stripe overview fetch failed:', err)
    res.status(500).json({ configured: true, error: true })
  }
})
