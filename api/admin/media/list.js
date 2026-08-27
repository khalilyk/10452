import { requireSession } from '../../_lib/adminAuth.js'
import { isStorageConfigured, listFiles } from '../../_lib/storage.js'

export default requireSession(async (req, res) => {
  if (!isStorageConfigured()) {
    res.status(200).json({ configured: false, files: [] })
    return
  }
  try {
    const files = await listFiles()
    res.status(200).json({ configured: true, files })
  } catch (err) {
    console.error('Listing media failed:', err)
    res.status(500).json({ configured: true, files: [], error: true })
  }
})
