import { FaqList } from '@/components/support/FaqList'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Typography } from '@/components/ui/Typography'
import { SUPPORT_CONTENT, SupportSectionId } from '@/constants/support'
import { ButtonSize, TypographyAlign, TypographyVariant } from '@/constants/ui'
import { useFaqItems } from '@/hooks/useSupportContent'
import { AlertIcon } from '@/components/icons'

/** FAQs (hidden when there are none). */
export function SupportFaqSection() {
  const faq = useFaqItems()
  const { faq: copy } = SUPPORT_CONTENT
  if (faq.isSuccess && faq.data.length === 0) return null

  return (
    <section id={SupportSectionId.Faq} aria-labelledby="support-faq-title" className="mt-10 scroll-mt-28 sm:mt-14">
      <Typography as="h2" id="support-faq-title" variant={TypographyVariant.Heading} align={TypographyAlign.CenterBelowLg}>
        {copy.title}
      </Typography>
      <div className="mt-5 sm:mt-6">
        {faq.isPending ? (
          <div aria-hidden="true" className="flex flex-col gap-2.5">
            <Skeleton className="h-[54px] rounded-[20px]" />
            <Skeleton className="h-[54px] rounded-[20px]" />
            <Skeleton className="h-[54px] rounded-[20px]" />
          </div>
        ) : faq.isError ? (
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
        ) : (
          <FaqList items={faq.data} />
        )}
      </div>
    </section>
  )
}
