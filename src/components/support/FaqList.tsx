import { useState } from 'react'
import { RichText } from '@/components/common/RichText'
import { CollapsibleRow } from '@/components/ui/CollapsibleRow'
import { Typography } from '@/components/ui/Typography'
import { FAQ_TOPIC_LABELS, SUPPORT_CONTENT } from '@/constants/support'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import type { FaqItem, FaqTopic } from '@/types/support.types'

export interface FaqListProps {
  items: readonly FaqItem[]
}

/** Questions grouped by topic; one answer open at a time. */
export function FaqList({ items }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const topics = [...new Set(items.map((item) => item.topic))] as FaqTopic[]

  return (
    <div className="flex flex-col gap-6">
      {topics.map((topic) => (
        <div key={topic}>
          <Typography variant={TypographyVariant.Eyebrow} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg}>
            {FAQ_TOPIC_LABELS[topic]}
          </Typography>
          <ul className="mt-3 flex flex-col gap-2.5">
            {items
              .filter((item) => item.topic === topic)
              .map((item) => (
                <li key={item.id}>
                  <CollapsibleRow label={item.question} wrapLabel open={openId === item.id} onOpenChange={(open) => setOpenId(open ? item.id : null)}>
                    <RichText html={item.answer} empty={SUPPORT_CONTENT.faq.empty} />
                  </CollapsibleRow>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
