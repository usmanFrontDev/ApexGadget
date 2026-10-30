import type { IconProps } from './types'

export function CameraIcon(props: IconProps) {
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
      <path d="M4 8.5h3l1.5-2.5h7L17 8.5h3V19H4z" /><circle cx="12" cy="13.5" r="3.2" />
    </svg>
  )
}
