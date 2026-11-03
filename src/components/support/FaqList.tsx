import { useState } from 'react'
import { RichText } from '@/components/common/RichText'
import { CollapsibleRow } from '@/components/ui/CollapsibleRow'
import { SUPPORT_CONTENT } from '@/constants/support'
import { CollapsibleRowVariant } from '@/constants/ui'
import type { FaqItem } from '@/types/support.types'

export interface FaqListProps {
  items: readonly FaqItem[]
}

/** Questions as plain rows with a plus / minus; one answer open at a time. */
export function FaqList({ items }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <ul className="border-t border-ink/9 [&>li:last-child>div]:border-b-0">
      {items.map((item) => (
        <li key={item.id}>
          <CollapsibleRow
            variant={CollapsibleRowVariant.Plain}
            label={item.question}
            wrapLabel
            open={openId === item.id}
            onOpenChange={(open) => setOpenId(open ? item.id : null)}
          >
            <RichText html={item.answer} empty={SUPPORT_CONTENT.faq.empty} />
          </CollapsibleRow>
        </li>
      ))}
    </ul>
  )
}
