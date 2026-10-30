import type { IconProps } from './types'

export function ChipIcon(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="7" y="7" width="10" height="10" rx="2" /><path d="M10 3.5v3.5M14 3.5v3.5M10 17v3.5M14 17v3.5M3.5 10h3.5M3.5 14h3.5M17 10h3.5M17 14h3.5" />
    </svg>
  )
}
