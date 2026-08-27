import { requireSession } from '../_lib/adminAuth.js'
import { getContent, isDbConfigured, setContent } from '../_lib/db.js'

export default requireSession(async (req, res) => {
  if (!isDbConfigured()) {
    res.status(200).json({ configured: false, content: null })
    return
  }

  if (req.method === 'GET') {
    const content = await getContent()
    res.status(200).json({ configured: true, content })
    return
  }

  if (req.method === 'PUT') {
    const content = req.body
    if (!content || typeof content !== 'object') {
      res.status(400).json({ ok: false, reason: 'failed' })
      return
    }
    await setContent(content)
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ ok: false, reason: 'failed' })
})
