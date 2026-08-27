import { getContent, isKvConfigured } from './_lib/kv.js'

/**
 * Public: whatever content has been saved from /admin, or nothing if there's
 * no KV store or no edit has been made yet — the client already knows how to
 * fall back to its own defaults in that case, so this only ever returns real
 * overrides, never a guess.
 */
export default async function handler(req, res) {
  if (!isKvConfigured()) {
    res.status(200).json({ content: null })
    return
  }
  try {
    const content = await getContent()
    res.status(200).json({ content })
  } catch (err) {
    console.error('Fetching content failed:', err)
    res.status(200).json({ content: null })
  }
}
