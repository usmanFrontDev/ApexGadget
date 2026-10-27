import type { IconProps } from './types'

export function StarIcon(props: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 .8l1.85 4.05 4.4.4-3.3 2.9 1 4.3L7 10.2 3.05 12.45l1-4.3-3.3-2.9 4.4-.4z" />
    </svg>
  )
}
