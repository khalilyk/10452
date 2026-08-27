import { useContent } from '../content/ContentContext.tsx'

/**
 * The mark: "10452" with the plastic chair standing in for a third digit —
 * the Lebanese white plastic chair that comes up throughout the brand copy.
 *
 * The image itself is swappable from /admin's Logos section (content.brand.logoUrl),
 * so a rebrand doesn't need a code change or a redeploy.
 */
export function Logo({ className = '' }: { className?: string }) {
  const { brand } = useContent()
  return (
    <a href="/" aria-label="10452.SPACE, home" className={`inline-flex items-center ${className}`}>
      <img src={brand.logoUrl} alt="10452.SPACE" className="h-11 w-auto sm:h-[52px]" />
    </a>
  )
}
