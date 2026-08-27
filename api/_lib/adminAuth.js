import crypto from 'node:crypto'
import { getPasswordHash, isDbConfigured, setPasswordHash } from './db.js'

/**
 * Stateless admin sessions: the cookie is `${expiresAt}.${signature}`, an
 * HMAC-SHA256 of expiresAt keyed on ADMIN_SESSION_SECRET. Anyone holding a
 * valid cookie can prove it was issued by someone who knows the secret and
 * hasn't expired — that's the whole scheme. There is exactly one admin, so
 * there is nothing per-user to look up.
 *
 * The password itself has two possible sources, checked in order:
 *
 *  1. A scrypt hash saved in the database, once someone changes the
 *     password from the Account page. This is what "editing your account"
 *     actually updates — there's no separate password store, just this one
 *     row.
 *  2. ADMIN_PASSWORD, the Vercel environment variable — the bootstrap
 *     password, used only until a real one is set. Kept around rather than
 *     cleared, so a broken database connection can't lock the one admin out
 *     entirely.
 *
 * ADMIN_SESSION_SECRET must always be set: it signs the cookie, and an admin
 * panel "protected" by a blank signing secret is worse than one that refuses
 * to load.
 */

const COOKIE_NAME = '10452_admin'
const SESSION_MS = 1000 * 60 * 60 * 12 // 12 hours

function sign(expiresAt) {
  const secret = process.env.ADMIN_SESSION_SECRET
  return crypto.createHmac('sha256', secret).update(String(expiresAt)).digest('hex')
}

export function isAdminConfigured() {
  return !!(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a || ''))
  const bufB = Buffer.from(String(b || ''))
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyHashedPassword(candidate, stored) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidateHash = crypto.scryptSync(String(candidate || ''), salt, 64)
  const storedHash = Buffer.from(hash, 'hex')
  if (candidateHash.length !== storedHash.length) return false
  return crypto.timingSafeEqual(candidateHash, storedHash)
}

export async function checkPassword(candidate) {
  if (isDbConfigured()) {
    const stored = await getPasswordHash().catch(() => null)
    if (stored) return verifyHashedPassword(candidate, stored)
  }
  return timingSafeStringEqual(candidate, process.env.ADMIN_PASSWORD)
}

export async function setNewPassword(password) {
  await setPasswordHash(hashPassword(password))
}

export function makeSessionCookie() {
  const expiresAt = Date.now() + SESSION_MS
  const token = `${expiresAt}.${sign(expiresAt)}`
  const maxAge = Math.floor(SESSION_MS / 1000)
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
}

function parseCookies(header) {
  const out = {}
  ;(header || '').split(';').forEach((pair) => {
    const i = pair.indexOf('=')
    if (i === -1) return
    out[pair.slice(0, i).trim()] = decodeURIComponent(pair.slice(i + 1).trim())
  })
  return out
}

export function hasValidSession(req) {
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies[COOKIE_NAME]
  if (!token) return false
  const [expiresAtStr, signature] = token.split('.')
  const expiresAt = Number(expiresAtStr)
  if (!expiresAt || !signature || Date.now() > expiresAt) return false
  const expected = sign(expiresAt)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/** Wraps an admin API handler: 401s before any real work happens if the session is missing or invalid. */
export function requireSession(handler) {
  return async (req, res) => {
    if (!isAdminConfigured()) {
      res.status(503).json({ ok: false, reason: 'not-configured' })
      return
    }
    if (!hasValidSession(req)) {
      res.status(401).json({ ok: false, reason: 'unauthorized' })
      return
    }
    return handler(req, res)
  }
}
