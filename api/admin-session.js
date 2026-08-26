import { hasValidSession, isAdminConfigured } from './_lib/adminAuth.js'

/** Cheap check the admin app calls on load to decide login screen vs dashboard. */
export default async function handler(req, res) {
  res.status(200).json({
    configured: isAdminConfigured(),
    authed: isAdminConfigured() && hasValidSession(req),
  })
}
