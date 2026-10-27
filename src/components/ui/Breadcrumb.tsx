import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  /** Omit on the current page. */
  to?: string
}

export interface BreadcrumbProps {
  items: readonly BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-ink/30">
                /
              </span>
            )}
            {item.to ? (
              <Link to={item.to} className="text-ink/60 transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
