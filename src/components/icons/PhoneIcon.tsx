import type { IconProps } from './types'

export function PhoneIcon(props: IconProps) {
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
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" />
    </svg>
  )
}
