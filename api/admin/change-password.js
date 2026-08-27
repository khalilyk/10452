import { checkPassword, requireSession, setNewPassword } from '../_lib/adminAuth.js'
import { isDbConfigured } from '../_lib/db.js'

export default requireSession(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'failed' })
    return
  }

  if (!isDbConfigured()) {
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }

  const { currentPassword, newPassword } = req.body || {}
  if (!newPassword || String(newPassword).length < 8) {
    res.status(400).json({ ok: false, reason: 'too-short' })
    return
  }

  if (!(await checkPassword(currentPassword))) {
    res.status(401).json({ ok: false, reason: 'wrong-password' })
    return
  }

  await setNewPassword(String(newPassword))
  res.status(200).json({ ok: true })
})
