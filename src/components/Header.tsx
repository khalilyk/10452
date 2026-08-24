import { Logo } from './Logo.tsx'
import { SHIPPING } from '../data/drops.ts'

/**
 * Announcement bar and header.
 *
 * The drop number sits dead centre because it is the only navigation this brand
 * has — there is one product, and the header's job is to say which chapter you
 * are in.
 */
export function Header({ dropNumber, cartCount }: { dropNumber: string; cartCount: number }) {
  return (
    <header>
      <div className="bg-ink py-2.5 text-center text-[11px] font-medium tracking-widest text-white sm:text-[12px]">
        {SHIPPING}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 px-5 py-4 sm:px-8 sm:py-5">
        <Logo />

        <span className="self-center text-[13px] font-medium tracking-widest sm:text-[15px]">
          DROP {dropNumber}
        </span>

        <button
          type="button"
          className="justify-self-end self-center text-[13px] font-medium tracking-widest transition-opacity hover:opacity-60 sm:text-[15px]"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        >
          CART({cartCount})
        </button>
      </div>
    </header>
  )
}
