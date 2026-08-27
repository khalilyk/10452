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

export interface OrderAddress {
  line1: string
  line2: string
  city: string
  region: string
  postcode: string
  country: string
}

export interface FullOrder {
  id: string
  createdAt: string
  amountAud: number
  currency: string
  email: string
  name: string
  phone: string
  dropNumber: string
  size: string
  quantity: string
  notes: string
  address: OrderAddress | null
}

export interface OrdersData {
  configured: boolean
  orders: FullOrder[]
  hasMore: boolean
  lastId?: string | null
  error?: boolean
}

export async function fetchOrders(startingAfter?: string): Promise<OrdersData> {
  const qs = startingAfter ? `?startingAfter=${encodeURIComponent(startingAfter)}` : ''
  const res = await fetch(`/api/admin/orders${qs}`, { credentials: 'same-origin' })
  if (res.status === 401) return { configured: false, orders: [], hasMore: false }
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

export interface MediaFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export interface MediaData {
  configured: boolean
  files: MediaFile[]
}

export async function fetchMedia(): Promise<MediaData> {
  const res = await fetch('/api/admin/media/list', { credentials: 'same-origin' })
  if (res.status === 401) return { configured: false, files: [] }
  return res.json()
}

export async function uploadMedia(file: File): Promise<{ ok: boolean; url?: string; reason?: string }> {
  const res = await fetch(`/api/admin/media/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
  return res.json()
}

export async function deleteMedia(pathname: string): Promise<{ ok: boolean }> {
  const res = await fetch('/api/admin/media/delete', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathname }),
  })
  return res.json()
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; reason?: string }> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return res.json()
}
