/**
 * Storage, backed by the Supabase Postgres project already running for
 * Print Paradise (printparadise.com.au) — the same business that operates
 * 10452.SPACE — rather than provisioning a separate paid Upstash/KV store
 * for what is, realistically, a handful of small tables.
 *
 * Plain fetch against Supabase's PostgREST REST API, not the supabase-js
 * SDK: this only ever needs get/insert/upsert on three tables from server
 * code, and a client library for that is more surface area than the job
 * needs. All three tables live in the default `public` schema, prefixed
 * `app10452_`, so nothing here can collide with whatever printparadise's own
 * site already keeps in that database.
 *
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be copied into this
 * Vercel project's environment variables from the printparadise project —
 * copying credential values between projects isn't something done here in
 * code, only by hand in the Vercel dashboard.
 */

const CONTENT_TABLE = 'app10452_content'
const SUBMISSIONS_TABLE = 'app10452_submissions'
const ADMIN_TABLE = 'app10452_admin'

export function isDbConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function rest(path, init = {}) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Supabase request failed (${res.status}): ${path} ${body}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function getContent() {
  const rows = await rest(`${CONTENT_TABLE}?id=eq.1&select=data`)
  return rows?.[0]?.data ?? null
}

export async function setContent(content) {
  await rest(CONTENT_TABLE, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: 1, data: content, updated_at: new Date().toISOString() }),
  })
}

export async function pushSubmission(entry) {
  await rest(SUBMISSIONS_TABLE, {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      name: entry.name,
      email: entry.email,
      message: entry.message,
      received_at: entry.receivedAt,
    }),
  })
}

export async function listSubmissions() {
  const rows = await rest(`${SUBMISSIONS_TABLE}?order=received_at.desc&limit=200`)
  return (rows || []).map((r) => ({
    name: r.name || '',
    email: r.email || '',
    message: r.message,
    receivedAt: r.received_at,
  }))
}

export async function getPasswordHash() {
  const rows = await rest(`${ADMIN_TABLE}?id=eq.1&select=password_hash`)
  return rows?.[0]?.password_hash ?? null
}

export async function setPasswordHash(hash) {
  await rest(ADMIN_TABLE, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: 1, password_hash: hash }),
  })
}
