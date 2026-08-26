import { isKvConfigured, pushSubmission } from './_lib/kv.js'

/**
 * Public endpoint the contact form posts to, best-effort, alongside its
 * existing mailto behaviour. Nothing about the visible contact flow changes
 * if this fails or KV isn't configured — it's purely so submissions show up
 * in /admin once a KV store is attached.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'failed' })
    return
  }

  if (!isKvConfigured()) {
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }

  const { name, email, message } = req.body || {}
  if (!message || !String(message).trim()) {
    res.status(400).json({ ok: false, reason: 'failed' })
    return
  }

  try {
    await pushSubmission({
      name: name || '',
      email: email || '',
      message: String(message).trim(),
      receivedAt: new Date().toISOString(),
    })
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Submission store failed:', err)
    res.status(200).json({ ok: false, reason: 'failed' })
  }
}
