import { HeartIcon } from '@/components/icons'

/** A phone outline with a red heart badge (inline art, theme colours only). */
export function EmptyCartIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[150px] w-[120px]">
      <span className="absolute inset-x-2 inset-y-4 rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.1),transparent_95%)]" />
      <svg viewBox="0 0 96 144" fill="none" className="relative size-full text-ink/25">
        <rect x="14" y="8" width="68" height="128" rx="14" fill="white" fillOpacity="0.9" stroke="currentColor" strokeWidth="2.5" />
        <rect x="38" y="16" width="20" height="5" rx="2.5" fill="currentColor" />
      </svg>
      <span className="absolute right-0 top-9 grid size-9 place-items-center rounded-full bg-white text-primary shadow-glass-soft">
        <HeartIcon width={16} height={16} fill="currentColor" />
      </span>
    </div>
  )
}
