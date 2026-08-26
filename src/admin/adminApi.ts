/**
 * Fetch wrappers for the admin API.
 *
 * `credentials: 'same-origin'` on every call so the session cookie actually
 * goes with the request — the default is 'same-origin' for same-origin
 * requests in a browser anyway, but Vercel functions are subtle enough about
 * cookies that it's worth being explicit rather than relying on the default.
 */

export interface SessionState {
  configured: boolean
  authed: boolean
}

export async function fetchSession(): Promise<SessionState> {
  const res = await fetch('/api/admin-session', { credentials: 'same-origin' })
  return res.json()
}

export async function login(password: string): Promise<{ ok: boolean; reason?: string }> {
  const res = await fetch('/api/admin-login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return res.json()
}

export async function logout(): Promise<void> {
  await fetch('/api/admin-logout', { method: 'POST', credentials: 'same-origin' })
}

export interface Order {
  id: string
  createdAt: string
  amountAud: number
  email: string
  size: string
  dropNumber: string
}

export interface OverviewData {
  configured: boolean
  revenueAud?: number
  orderCount?: number
  orders?: Order[]
  error?: boolean
}

export async function fetchOverview(): Promise<OverviewData> {
  const res = await fetch('/api/admin/overview', { credentials: 'same-origin' })
  if (res.status === 401) return { configured: false }
  return res.json()
}

export interface Submission {
  name: string
  email: string
  message: string
  receivedAt: string
}

export interface SubmissionsData {
  configured: boolean
  submissions: Submission[]
}

export async function fetchSubmissions(): Promise<SubmissionsData> {
  const res = await fetch('/api/admin/submissions', { credentials: 'same-origin' })
  if (res.status === 401) return { configured: false, submissions: [] }
  return res.json()
}
