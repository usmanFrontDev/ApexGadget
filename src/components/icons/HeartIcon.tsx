import type { IconProps } from './types'

export function HeartIcon(props: IconProps) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8.5 14.2S2 10.5 2 6.4C2 4.5 3.4 3 5.3 3c1.2 0 2.3.6 3.2 1.8C9.4 3.6 10.5 3 11.7 3 13.6 3 15 4.5 15 6.4c0 4.1-6.5 7.8-6.5 7.8z" />
    </svg>
  )
}
