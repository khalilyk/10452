import { useEffect, useState } from 'react'

/**
 * A Vestaboard-style split-flap readout.
 *
 * Every tile steps forward through one fixed character sequence — it cannot
 * jump straight to its target any more than the real board can, which is where
 * the riffle comes from. Each tile is given a different number of extra
 * revolutions so the row settles left to right instead of landing as a block.
 */

/** Blank sits at the head of the sequence, as it does on the board. */
const SEQ = ' 0123456789'

const STEP_MS = 90

const mod = (n: number) => ((n % SEQ.length) + SEQ.length) % SEQ.length

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function SplitFlap({
  value,
  chip = false,
  dim = false,
  label,
}: {
  /** Rendered one tile per character; pad with spaces for blank tiles. */
  value: string
  /** Lead with a solid colour chip, the way a board is accented. */
  chip?: boolean
  /** Sold out — the glyphs go quiet but the board stays lit. */
  dim?: boolean
  /** What a screen reader hears instead of the tiles. */
  label: string
}) {
  const chars = value.split('')

  return (
    <div
      className="flap flex gap-[3px]"
      style={dim ? ({ '--flap-ink': 'rgba(242,241,237,0.32)' } as React.CSSProperties) : undefined}
    >
      <span className="sr-only">{label}</span>
      {chip && <div aria-hidden className="flap-tile flap-tile--chip"><Resting top=" " bottom=" " /></div>}
      {chars.map((c, i) => (
        // Index is the identity here: tile 2 stays tile 2 when the value
        // changes, which is what lets it flap rather than remount.
        <Tile key={i} char={c} extra={7 + i * 3} />
      ))}
    </div>
  )
}

function Tile({ char, extra }: { char: string; extra: number }) {
  const target = Math.max(0, SEQ.indexOf(char))
  const [{ prev, cur, tick }, set] = useState(() => ({ prev: target, cur: target, tick: 0 }))

  useEffect(() => {
    if (reducedMotion()) {
      set((s) => ({ prev: target, cur: target, tick: s.tick + 1 }))
      return
    }

    // Wind back `extra` places and let it walk forward to the target.
    let at = mod(target - extra)
    set((s) => ({ prev: mod(at - 1), cur: at, tick: s.tick + 1 }))
    if (at === target) return

    const id = setInterval(() => {
      const from = at
      at = mod(at + 1)
      set((s) => ({ prev: from, cur: at, tick: s.tick + 1 }))
      if (at === target) clearInterval(id)
    }, STEP_MS)

    return () => clearInterval(id)
  }, [target, extra])

  return (
    <div aria-hidden className="flap-tile">
      {/* At rest behind the folds: the incoming character's top half is already
          in place, while the bottom still shows the outgoing one. */}
      <Resting top={SEQ[cur]} bottom={SEQ[prev]} />
      {/* Keyed on the step so each flap restarts the animation. */}
      <div key={`t${tick}`} className="flap-half flap-half--top flap-fold flap-fold--top">
        <span className="flap-glyph">{SEQ[prev]}</span>
      </div>
      <div key={`b${tick}`} className="flap-half flap-half--bottom flap-fold flap-fold--bottom">
        <span className="flap-glyph">{SEQ[cur]}</span>
      </div>
    </div>
  )
}

function Resting({ top, bottom }: { top: string; bottom: string }) {
  return (
    <>
      <div className="flap-half flap-half--top"><span className="flap-glyph">{top}</span></div>
      <div className="flap-half flap-half--bottom"><span className="flap-glyph">{bottom}</span></div>
    </>
  )
}
