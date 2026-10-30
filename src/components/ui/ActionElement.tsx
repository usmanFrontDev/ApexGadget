import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface ActionElementProps {
  className?: string
  children?: ReactNode
  /** Internal route -> react-router `<Link>`. */
  to?: string
  /** Hash / external URL -> plain `<a>`. */
  href?: string
  target?: string
  rel?: string
  onClick?: MouseEventHandler<HTMLElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  id?: string
  'aria-label'?: string
  'aria-current'?: 'page'
  'aria-disabled'?: boolean
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-controls'?: string
  [dataAttribute: `data-${string}`]: string | undefined
}

/**
 * Renders the right element for the job: `<Link>` when `to` is set,
 * `<a>` when `href` is set, otherwise `<button>`. Base for Button / IconButton.
 */
export function ActionElement({
  to,
  href,
  type = 'button',
  disabled,
  target,
  rel,
  ...common
}: ActionElementProps) {
  if (to) return <Link to={to} {...common} />
  if (href) return <a href={href} target={target} rel={rel} {...common} />
  return <button type={type} disabled={disabled} {...common} />
}
