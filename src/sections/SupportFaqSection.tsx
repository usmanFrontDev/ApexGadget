import { useState } from 'react'
import { TextInput } from '@/components/form/TextInput'
import { AlertIcon, SearchIcon } from '@/components/icons'
import { FaqList } from '@/components/support/FaqList'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Typography } from '@/components/ui/Typography'
import { SUPPORT_CONTENT, SupportSectionId } from '@/constants/support'
import { ButtonSize, ChipSize, GlassCardVariant, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useFaqItems } from '@/hooks/useSupportContent'
import { htmlToText } from '@/lib/html'
import type { FaqItem } from '@/types/support.types'

const matches = (item: FaqItem, term: string) =>
  `${item.question} ${htmlToText(item.answer)}`.toLowerCase().includes(term.toLowerCase())

/** FAQs: title and search on the left, the questions on the right (stacked below lg). Hidden when there are none. */
export function SupportFaqSection() {
  const faq = useFaqItems()
  const [term, setTerm] = useState('')
  const { faq: copy } = SUPPORT_CONTENT
  if (faq.isSuccess && faq.data.length === 0) return null

  const visible = (faq.data ?? []).filter((item) => !term.trim() || matches(item, term.trim()))

  let list
  if (faq.isPending) {
    list = (
      <div aria-hidden="true" className="flex flex-col gap-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    )
  } else if (faq.isError) {
    list = (
      <EmptyState
        icon={<AlertIcon width={24} height={24} />}
        title={copy.error}
        description=""
        action={
          <Button size={ButtonSize.Md} onClick={() => faq.refetch()}>
            {copy.retry}
          </Button>
        }
      />
    )
  } else if (visible.length === 0) {
    list = (
      <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} aria-live="polite">
        {copy.noMatch}
      </Typography>
    )
  } else {
    list = <FaqList items={visible} />
  }

  return (
    <section id={SupportSectionId.Faq} aria-labelledby="support-faq-title" className="mt-6 scroll-mt-28 sm:mt-8">
      <GlassCard variant={GlassCardVariant.Soft} className="rounded-[28px]">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-0 lg:p-0">
          <div className="flex flex-col items-center lg:items-start lg:p-10">
            <Chip size={ChipSize.Xs} icon={<span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />}>
              <span className="font-bold uppercase tracking-[1.2px]">{copy.eyebrow}</span>
            </Chip>
            <Typography as="h2" id="support-faq-title" variant={TypographyVariant.Heading} align={TypographyAlign.CenterBelowLg} className="mt-3">
              {copy.title}
            </Typography>
            <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.CenterBelowLg} className="mt-2">
              {copy.lead}
            </Typography>
            <div role="search" className="relative mt-6 w-full max-w-[420px]">
              <label htmlFor="faq-search" className="sr-only">
                {copy.searchLabel}
              </label>
              <SearchIcon aria-hidden="true" width={18} height={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/55" />
              <TextInput
                id="faq-search"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder={copy.search}
                autoComplete="off"
                className="h-12 rounded-full pl-11 [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>
          </div>
          <div className="relative min-w-0 lg:p-8">
            <span aria-hidden="true" className="absolute inset-y-8 left-0 hidden w-px bg-ink/9 lg:block" />
            {list}
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
