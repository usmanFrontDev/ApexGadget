import type { IconProps } from './types'

export function CardIcon(props: IconProps) {
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
      <rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18M7 15h3" />
    </svg>
  )
}
