import type { IconProps } from './types'

export function HeadsetIcon(props: IconProps) {
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
      <path d="M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13" /><rect x="3.5" y="12.5" width="3.5" height="6" rx="1.5" /><rect x="17" y="12.5" width="3.5" height="6" rx="1.5" /><path d="M19 18.5c0 1.7-1.6 2.5-4 2.5h-1.5" />
    </svg>
  )
}
