import type { Drop } from '../data/drops.ts'

/**
 * The campaign image, full bleed.
 *
 * Until a photograph exists this renders a marked-up frame rather than a grey
 * box or a stock image: crop marks, the location, the frame number. It reads as
 * a contact sheet waiting to be filled, which is honest about the state of the
 * shoot and still looks like it belongs to the brand.
 */
export function Hero({ drop }: { drop: Drop }) {
  if (drop.image) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink sm:aspect-[16/10] lg:aspect-[16/9]">
        <img
          src={drop.image}
          alt={`${drop.name} — photographed in ${drop.location}`}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper sm:aspect-[16/10] lg:aspect-[16/9]">
      <CropMarks />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="text-[10px] tracking-widest text-ink/40">
          DROP {drop.number} — CAMPAIGN
        </span>
        <span className="text-[13px] tracking-widest text-ink/70 sm:text-[15px]">
          {drop.location.toUpperCase()}
        </span>
        <span className="max-w-xs text-[10.5px] leading-relaxed tracking-wide text-ink/40">
          Photograph pending. Drop the file in{' '}
          <code className="text-ink/60">public/drops/</code> and set{' '}
          <code className="text-ink/60">image</code> on the drop.
        </span>
      </div>
    </div>
  )
}

function CropMarks() {
  const mark = 'absolute h-px w-6 bg-ink/25'
  const markV = 'absolute h-6 w-px bg-ink/25'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className={`${mark} left-4 top-4`} />
      <span className={`${markV} left-4 top-4`} />
      <span className={`${mark} right-4 top-4`} />
      <span className={`${markV} right-4 top-4`} />
      <span className={`${mark} bottom-4 left-4`} />
      <span className={`${markV} bottom-4 left-4`} />
      <span className={`${mark} bottom-4 right-4`} />
      <span className={`${markV} bottom-4 right-4`} />
    </div>
  )
}
