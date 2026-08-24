/**
 * The mark: "10452" with the plastic chair standing in for a third digit —
 * the Lebanese white plastic chair that comes up throughout the brand copy.
 *
 * A single flat asset rather than drawn text: the chair is illustration, not
 * type, so there is no typeface substitute for it. Alt text carries the name
 * for anyone not seeing the image; the anchor's aria-label would only repeat it.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" aria-label="10452.SPACE, home" className={`inline-flex items-center ${className}`}>
      <img src="/brand/logo.png" alt="10452.SPACE" className="h-11 w-auto sm:h-[52px]" />
    </a>
  )
}
