import type { IconProps } from './types'

export function ClockIcon(props: IconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="6.5" cy="6.5" r="5" /><path d="M6.5 3.8v2.7l2 1" />
    </svg>
  )
}
