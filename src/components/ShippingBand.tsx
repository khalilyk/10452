import { useContent } from '../content/ContentContext.tsx'

/**
 * Worldwide shipping, full bleed.
 *
 * A wireframe globe turns behind the type. The spin is done by scaling each
 * meridian horizontally on a phase offset rather than rotating the whole
 * drawing — rotating it in the plane reads as tumbling, whereas meridians
 * narrowing to a line and opening out again is what a globe turning on its axis
 * actually looks like.
 *
 * It sits behind the text at low contrast and stops entirely under
 * prefers-reduced-motion; a large moving object next to the one thing the
 * section is trying to say would compete with it.
 */
const MERIDIANS = 6

export function ShippingBand() {
  const { shippingAud } = useContent()
  return (
    <section className="relative overflow-hidden bg-ink" aria-labelledby="shipping-heading">
      <style>{`
        @keyframes meridian-turn {
          0%   { transform: scaleX(1); }
          25%  { transform: scaleX(0.02); }
          50%  { transform: scaleX(-1); }
          75%  { transform: scaleX(0.02); }
          100% { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .meridian { animation: none !important; }
        }
      `}</style>

      <Globe />

      <div className="relative flex flex-col items-center gap-4 px-5 py-32 text-center sm:py-40">
        <h2
          id="shipping-heading"
          className="text-[26px] font-medium tracking-[0.14em] text-white sm:text-[38px]"
        >
          ${shippingAud} SHIPPING WORLDWIDE
        </h2>
        <p className="max-w-sm text-[12px] leading-relaxed tracking-wide text-white/60">
          Wherever you ended up. Flat rate, every country, no exceptions.
        </p>
      </div>
    </section>
  )
}

function Globe() {
  const R = 130
  const C = 160

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 320 320"
        className="h-[150%] w-auto opacity-30"
        fill="none"
        stroke="white"
        strokeWidth="3"
      >
        <circle cx={C} cy={C} r={R} />

        {/* Parallels: fixed ellipses, flattening toward the poles. */}
        {[-0.72, -0.42, 0, 0.42, 0.72].map((t, i) => (
          <ellipse
            key={i}
            cx={C}
            cy={C + t * R}
            rx={R * Math.sqrt(1 - t * t)}
            ry={R * 0.085 * Math.sqrt(1 - t * t)}
            strokeWidth={2.2}
          />
        ))}

        {/* Meridians: each is a full-height ellipse whose width is animated, so
            the set reads as a sphere turning rather than a disc rotating. */}
        {Array.from({ length: MERIDIANS }, (_, i) => (
          <ellipse
            key={i}
            className="meridian"
            cx={C}
            cy={C}
            rx={R}
            ry={R}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: `meridian-turn 26s linear infinite`,
              animationDelay: `${-(26 / MERIDIANS) * i}s`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
