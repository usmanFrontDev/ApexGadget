import { Typography } from '@/components/ui/Typography'
import { TypographyTone, TypographyVariant } from '@/constants/ui'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

export interface RichTextProps {
  /** Shopify / mock HTML: always sanitised here. */
  html: string | undefined
  /** Shown when there is no text. */
  empty: string
}

/** Sanitised Shopify HTML in the `.rich-text` style (descriptions, policies, FAQ answers). */
export function RichText({ html, empty }: RichTextProps) {
  const clean = html ? sanitizeHtml(html).trim() : ''
  if (!clean) {
    return (
      <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted}>
        {empty}
      </Typography>
    )
  }
  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: clean }} />
}
