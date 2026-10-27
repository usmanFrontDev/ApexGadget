import type { IconProps } from './types'

export function ShieldIcon(props: IconProps) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9.5 2.3l5.7 2.1v4.4c0 3.3-2.4 6-5.7 7.5-3.3-1.5-5.7-4.2-5.7-7.5V4.4z" />
      <path d="M7.1 9.3l1.7 1.7 3.2-3.3" />
    </svg>
  )
}
