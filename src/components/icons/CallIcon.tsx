import type { IconProps } from './types'

export function CallIcon(props: IconProps) {
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
      <path d="M6.6 3.5h2.3l1.4 3.6-1.7 1.2a10.5 10.5 0 0 0 5.1 5.1l1.2-1.7 3.6 1.4v2.3a2 2 0 0 1-2.2 2A13.5 13.5 0 0 1 4.6 5.7 2 2 0 0 1 6.6 3.5Z" />
    </svg>
  )
}
