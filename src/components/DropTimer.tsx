import { useEffect, useState } from 'react'

/**
 * A live countdown to when the drop's 30-day window closes.
 *
 * The deadline is a fixed point in time (releasedAt + 30 days), not "30 days
 * from whenever you happened to load the page" — otherwise two visitors on
 * the same day would see different countdowns, which reads as fake urgency
 * rather than a real one.
 */
export function DropTimer({ closesAt }: { closesAt: Date }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const msLeft = closesAt.getTime() - now

  if (msLeft <= 0) {
    return <span className="text-liban-red">DROP CLOSED</span>
  }

  const totalSeconds = Math.floor(msLeft / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <span className="text-liban-red tabular-nums" role="timer" aria-live="off">
      {days}D {pad(hours)}H {pad(minutes)}M {pad(seconds)}S
    </span>
  )
}
