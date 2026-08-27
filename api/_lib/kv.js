/**
 * Thin wrapper over Vercel KV's REST API (Upstash-compatible) — submissions
 * (a list) and site content (a single JSON blob) both live here.
 *
 * Plain fetch rather than the @vercel/kv SDK: it's a handful of HTTP calls,
 * and pulling in a client library for that is the kind of dependency that
 * outlives its reason for being there. KV_REST_API_URL / KV_REST_API_TOKEN
 * are injected automatically once a KV store is attached to the Vercel
 * project — nothing to configure by hand beyond that.
 */

const SUBMISSIONS_KEY = 'submissions'
const CONTENT_KEY = 'site-content'
const PASSWORD_HASH_KEY = 'admin-password-hash'

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

export async function getContent() {
  const raw = await kv(`get/${CONTENT_KEY}`)
  return raw ? JSON.parse(raw) : null
}

export async function setContent(content) {
  await kv(`set/${CONTENT_KEY}/${encodeURIComponent(JSON.stringify(content))}`)
}

export async function getPasswordHash() {
  return kv(`get/${PASSWORD_HASH_KEY}`)
}

export async function setPasswordHash(hash) {
  await kv(`set/${PASSWORD_HASH_KEY}/${hash}`)
}
