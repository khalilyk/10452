/**
 * Thin wrapper over Vercel KV's REST API (Upstash-compatible), used only for
 * storing contact-form submissions.
 *
 * Plain fetch rather than the @vercel/kv SDK: it's two HTTP calls, and pulling
 * in a client library for two calls is the kind of dependency that outlives
 * its reason for being there. KV_REST_API_URL / KV_REST_API_TOKEN are
 * injected automatically once a KV store is attached to the Vercel project —
 * nothing to configure by hand beyond that.
 */

const SUBMISSIONS_KEY = 'submissions'

export function isKvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function kv(command) {
  const url = `${process.env.KV_REST_API_URL}/${command}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  })
  if (!res.ok) throw new Error(`KV command failed: ${command}`)
  const { result } = await res.json()
  return result
}

export async function pushSubmission(entry) {
  await kv(`lpush/${SUBMISSIONS_KEY}/${encodeURIComponent(JSON.stringify(entry))}`)
  await kv(`ltrim/${SUBMISSIONS_KEY}/0/499`) // keep the most recent 500
}

export async function listSubmissions() {
  const rows = await kv(`lrange/${SUBMISSIONS_KEY}/0/199`)
  return (rows || []).map((row) => JSON.parse(row))
}
