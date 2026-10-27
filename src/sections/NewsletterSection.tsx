import type { SubmitEventHandler } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { NEWSLETTER_CONTENT } from '@/constants/home'
import { ButtonSize } from '@/constants/ui'

export function NewsletterSection() {
  const { titleLines, description, placeholder, submitLabel, successMessage } = NEWSLETTER_CONTENT

  // UI only for now — wire to Shopify (customer marketing consent) via service -> hook later.
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    toast.success(successMessage)
    event.currentTarget.reset()
  }

  return (
    <section className="mt-14 lg:mt-20">
      <Container>
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#17070a_0%,#0c0c0e_62%)] px-6 py-8 shadow-newsletter sm:px-12 sm:py-[45px] lg:flex-row lg:items-center lg:justify-between">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-[140px] size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.08),transparent_95%)]"
          />

          <div className="relative text-paper">
            <h2 className="text-[26px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[34px] sm:leading-[35.4px]">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-3 font-body text-[14.5px] leading-5 text-paper/62">{description}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative flex h-[60px] w-full items-center rounded-full bg-white/92 pl-[23px] pr-[9px] shadow-ring lg:w-[552px]"
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
              className="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink/62"
            />
            <Button type="submit" size={ButtonSize.Xs} className="font-body">
              {submitLabel}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  )
}
