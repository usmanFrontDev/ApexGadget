import type { IconProps } from './types'

export function BadgeCheckIcon(props: IconProps) {
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
      <path d="m12 3 2.3 1.6 2.8.1 1 2.6 2.2 1.8-.8 2.7.8 2.7-2.2 1.8-1 2.6-2.8.1L12 21l-2.3-1.6-2.8-.1-1-2.6-2.2-1.8.8-2.7-.8-2.7 2.2-1.8 1-2.6 2.8-.1L12 3Z" />
      <path d="m8.8 12.2 2.3 2.3 4.2-4.6" />
    </svg>
  )
}
