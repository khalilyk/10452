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

export interface AdminContentState {
  configured: boolean
  content: Record<string, unknown> | null
}

async function fetchAdminContentRaw(): Promise<AdminContentState> {
  const res = await fetch('/api/admin/content', { credentials: 'same-origin' })
  if (res.status === 401) return { configured: false, content: null }
  return res.json()
}

export { fetchAdminContentRaw as fetchAdminContent }

/**
 * Saves one or more top-level sections of the content blob (e.g. "about",
 * "seo") by re-reading the latest saved content, replacing just those keys,
 * and writing the whole object back. Doing the read-merge-write here rather
 * than trusting a draft loaded minutes ago means two admin pages editing
 * different sections can't clobber each other.
 */
export async function saveAdminContentSections(
  sections: Record<string, unknown>,
): Promise<{ ok: boolean }> {
  const current = await fetchAdminContentRaw()
  const updated = { ...(current.content ?? {}), ...sections }
  const res = await fetch('/api/admin/content', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  })
  return res.json()
}
