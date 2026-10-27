import type { IconProps } from './types'

export function SlidersIcon(props: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 5h7M14 5h1M3 13h1M8 13h7" /><circle cx="12" cy="5" r="1.8" /><circle cx="6" cy="13" r="1.8" />
    </svg>
  )
}
