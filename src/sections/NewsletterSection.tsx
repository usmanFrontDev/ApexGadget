import type { SubmitEventHandler } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Typography } from '@/components/ui/Typography'
import { NEWSLETTER_CONTENT } from '@/constants/home'
import { ButtonSize, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

export function NewsletterSection() {
  const { titleLines, description, placeholder, submitLabel, successMessage } = NEWSLETTER_CONTENT

  // UI only for now — wire to Shopify (customer marketing consent) via service -> hook later.
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    toast.success(successMessage)
    event.currentTarget.reset()
  }

  return (
    <section className="mt-10 sm:mt-14 lg:mt-20">
      <Container>
        <div className="relative flex flex-col gap-5 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#17070a_0%,#0c0c0e_62%)] px-4 py-7 shadow-newsletter sm:gap-6 sm:px-12 sm:py-[45px] lg:flex-row lg:items-center lg:justify-between">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-[140px] size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.08),transparent_95%)]"
          />

          <div className="relative">
            <Typography
              variant={TypographyVariant.Title}
              tone={TypographyTone.Inverse}
              align={TypographyAlign.CenterBelowLg}
              className="sm:text-[30px] lg:text-[34px] lg:leading-[35.4px]"
            >
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </Typography>
            <Typography
              variant={TypographyVariant.Body}
              tone={TypographyTone.InverseMuted}
              align={TypographyAlign.CenterBelowLg}
              className="mt-2.5 sm:mt-3"
            >
              {description}
            </Typography>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative flex w-full flex-col gap-2.5 sm:h-[60px] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white/92 sm:pl-[23px] sm:pr-[9px] sm:shadow-ring lg:w-[552px]"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder={placeholder}
              autoComplete="email"
              className="h-[50px] w-full min-w-0 rounded-full bg-white/92 px-5 text-center text-[14.5px] text-ink shadow-ring outline-none placeholder:text-ink/62 sm:h-auto sm:flex-1 sm:rounded-none sm:bg-transparent sm:px-0 sm:text-left sm:shadow-none"
            />
            <Button type="submit" size={ButtonSize.Xs} className="font-body max-sm:h-[50px] max-sm:w-full">
              {submitLabel}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  )
}
