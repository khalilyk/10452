import { requireSession } from '../_lib/adminAuth.js'
import { isKvConfigured, listSubmissions } from '../_lib/kv.js'

export default requireSession(async (req, res) => {
  if (!isKvConfigured()) {
    res.status(200).json({ configured: false, submissions: [] })
    return
  }
  try {
    const submissions = await listSubmissions()
    res.status(200).json({ configured: true, submissions })
  } catch (err) {
    console.error('Fetching submissions failed:', err)
    res.status(500).json({ configured: true, submissions: [], error: true })
  }
})
