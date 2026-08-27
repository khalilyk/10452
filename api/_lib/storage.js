/**
 * Media, in a Supabase Storage bucket on the same project as api/_lib/db.js —
 * one already-provisioned, already-free backend for everything this admin
 * needs, rather than a second paid service (Vercel Blob) just for images.
 *
 * Bucket name is fixed rather than configurable: this project only ever
 * needs the one.
 */

const BUCKET = '10452-media'

export function isStorageConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function authHeaders(extra = {}) {
  return {
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ...extra,
  }
}

export function publicUrl(path) {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function uploadFile(path, buffer, contentType) {
  const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': contentType || 'application/octet-stream', 'x-upsert': 'true' }),
    body: buffer,
  })
  if (!res.ok) throw new Error(`Storage upload failed (${res.status}): ${await res.text().catch(() => '')}`)
  return publicUrl(path)
}

export async function listFiles() {
  const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ limit: 200, sortBy: { column: 'created_at', order: 'desc' } }),
  })
  if (!res.ok) throw new Error(`Storage list failed (${res.status}): ${await res.text().catch(() => '')}`)
  const items = await res.json()
  return items
    .filter((i) => i.id) // Supabase lists a placeholder row for the "directory" itself; it has no id.
    .map((i) => ({
      url: publicUrl(i.name),
      pathname: i.name,
      size: i.metadata?.size ?? 0,
      uploadedAt: i.created_at,
    }))
}

export async function deleteFile(path) {
  const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefixes: [path] }),
  })
  if (!res.ok) throw new Error(`Storage delete failed (${res.status}): ${await res.text().catch(() => '')}`)
}
