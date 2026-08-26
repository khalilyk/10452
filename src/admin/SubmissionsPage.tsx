import { useEffect, useState } from 'react'
import { fetchSubmissions, type SubmissionsData } from './adminApi.ts'
import { PageHeader, StatCard } from './ui.tsx'

export function SubmissionsPage() {
  const [data, setData] = useState<SubmissionsData | null>(null)

  useEffect(() => {
    fetchSubmissions().then(setData).catch(() => setData({ configured: false, submissions: [] }))
  }, [])

  return (
    <div>
      <PageHeader title="SUBMISSIONS" subtitle="CONTACT FORM" />

      {!data && (
        <p className="px-6 py-6 text-[11px] tracking-widest text-ink/50">LOADING…</p>
      )}

      {data && !data.configured && (
        <div className="px-6 py-6">
          <p className="max-w-md text-[12px] leading-relaxed text-ink/60">
            No KV store is attached to this project, so contact-form
            submissions have nowhere to land yet. Attach a Vercel KV store to
            the project (Storage tab in the Vercel dashboard) and this fills
            in automatically: no code changes needed.
          </p>
        </div>
      )}

      {data?.configured && (
        <>
          <div className="grid grid-cols-1 border-b-2 border-ink sm:grid-cols-2">
            <StatCard label="TOTAL SUBMISSIONS" value={String(data.submissions.length)} />
          </div>

          {data.submissions.length === 0 ? (
            <p className="px-6 py-6 text-[12px] text-ink/50">Nothing yet.</p>
          ) : (
            <ul>
              {data.submissions.map((s, i) => (
                <li key={i} className="border-b border-ink/15 px-6 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-[12.5px] font-medium">
                      {s.name || 'Someone'} {s.email && <span className="text-ink/50">({s.email})</span>}
                    </p>
                    <p className="text-[10.5px] tracking-widest text-ink/40">
                      {new Date(s.receivedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink/75">{s.message}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
