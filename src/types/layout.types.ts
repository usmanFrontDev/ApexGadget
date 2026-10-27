export interface NavItem {
  label: string
  to: string
}

export interface FooterLinkItem {
  label: string
  to?: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: readonly FooterLinkItem[]
}
