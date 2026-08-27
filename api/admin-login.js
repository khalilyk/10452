import { checkPassword, isAdminConfigured, makeSessionCookie } from './_lib/adminAuth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'failed' })
    return
  }

  if (!isAdminConfigured()) {
    res.status(503).json({ ok: false, reason: 'not-configured' })
    return
  }

  const { password } = req.body || {}
  if (!(await checkPassword(password))) {
    res.status(401).json({ ok: false, reason: 'wrong-password' })
    return
  }

  res.setHeader('Set-Cookie', makeSessionCookie())
  res.status(200).json({ ok: true })
}
