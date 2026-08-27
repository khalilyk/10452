import { requireSession } from '../../_lib/adminAuth.js'
import { isStorageConfigured, uploadFile } from '../../_lib/storage.js'

/**
 * A straight server-side upload: this is an admin-only tool for a handful of
 * product photos and logos, not a public upload surface at scale, so the
 * simpler path (browser PUTs the raw file, this function forwards it to
 * Storage) is the right amount of machinery. Vercel's request body limit
 * (a few MB) is the practical ceiling — plenty for web images.
 */
async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export default requireSession(async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).json({ ok: false, reason: 'failed' })
    return
  }

  if (!isStorageConfigured()) {
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }

  const filename = req.query?.filename
  if (!filename) {
    res.status(400).json({ ok: false, reason: 'failed' })
    return
  }

  try {
    const buffer = await readBody(req)
    const path = `${Date.now()}-${filename}`
    const url = await uploadFile(path, buffer, req.headers['content-type'])
    res.status(200).json({ ok: true, url })
  } catch (err) {
    console.error('Media upload failed:', err)
    res.status(500).json({ ok: false, reason: 'failed' })
  }
})
