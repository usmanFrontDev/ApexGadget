import type { CSSProperties } from 'react'

export interface RangeSliderProps {
  min: number
  max: number
  step: number
  /** [low, high] */
  value: readonly [number, number]
  onChange: (value: [number, number]) => void
  /** Accessible names of the two thumbs. */
  labels?: readonly [string, string]
}

const thumb =
  'pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[14px] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_white,0_2px_8px_rgb(200_32_40/0.45)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[14px] [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-[0_0_0_3px_white,0_2px_8px_rgb(200_32_40/0.45)] focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_3px_white,0_0_0_5px_var(--color-primary)]'

/** Two-thumb range slider built from two native range inputs (keyboard + touch friendly). */
export function RangeSlider({ min, max, step, value, onChange, labels = ['Minimum', 'Maximum'] }: RangeSliderProps) {
  const [low, high] = value
  const span = Math.max(1, max - min)
  // Data-driven geometry: only CSS variables are set inline, the look stays in classes.
  const fill = {
    '--range-start': `${((low - min) / span) * 100}%`,
    '--range-end': `${((high - min) / span) * 100}%`,
  } as CSSProperties

  return (
    <div className="relative h-5">
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink/12" />
      <div
        style={fill}
        className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-[linear-gradient(to_right,transparent_var(--range-start),var(--color-primary)_var(--range-start),var(--color-primary)_var(--range-end),transparent_var(--range-end))]"
      />
      <input
        type="range"
        aria-label={labels[0]}
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={(event) => onChange([Math.min(Number(event.target.value), high), high])}
        className={thumb}
      />
      <input
        type="range"
        aria-label={labels[1]}
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={(event) => onChange([low, Math.max(Number(event.target.value), low)])}
        className={thumb}
      />
    </div>
  )
}
