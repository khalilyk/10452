import { requireSession } from '../../_lib/adminAuth.js'
import { deleteFile, isStorageConfigured } from '../../_lib/storage.js'

export default requireSession(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'failed' })
    return
  }
  if (!isStorageConfigured()) {
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }
  const { pathname } = req.body || {}
  if (!pathname) {
    res.status(400).json({ ok: false, reason: 'failed' })
    return
  }
  try {
    await deleteFile(pathname)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Media delete failed:', err)
    res.status(500).json({ ok: false, reason: 'failed' })
  }
})
