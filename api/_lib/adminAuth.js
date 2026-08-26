import crypto from 'node:crypto'

/**
 * Stateless admin sessions: no database, so nothing to store or clean up.
 *
 * The cookie is `${expiresAt}.${signature}`, where signature is an
 * HMAC-SHA256 of expiresAt keyed on ADMIN_SESSION_SECRET. Anyone holding a
 * valid cookie can prove it was issued by someone who knows the secret and
 * hasn't expired — that's the whole scheme. There is exactly one admin, so
 * there is nothing per-user to look up.
 *
 * Both ADMIN_PASSWORD and ADMIN_SESSION_SECRET must be set in Vercel's
 * environment variables. Neither has a default: an admin panel that is
 * "protected" by a blank password is worse than one that refuses to load.
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

export function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD || ''
  const a = Buffer.from(String(candidate || ''))
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
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
