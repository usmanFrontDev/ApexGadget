import { Link } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import { ActionElement } from '@/components/ui/ActionElement'
import { Chip } from '@/components/ui/Chip'
import { Container } from '@/components/ui/Container'
import { Typography } from '@/components/ui/Typography'
import { COPYRIGHT_TEXT, FOOTER_COLUMNS, FOOTER_DESCRIPTION, PAYMENT_METHODS } from '@/constants/footer'
import { ROUTES } from '@/constants/routes'
import {
  ChipSize,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'

export function Footer() {
  return (
    <footer className="mt-10 pb-8 sm:mt-12 sm:pb-10 lg:mt-[85px]">
      <Container>
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col items-center lg:items-start">
            <Link to={ROUTES.home} aria-label="Apex Gadgets — home" className="inline-block">
              <img src={logo} alt="Apex Gadgets" width={80} height={32} className="h-[30px] w-auto" />
            </Link>
            <Typography
              variant={TypographyVariant.Body}
              tone={TypographyTone.Soft}
              align={TypographyAlign.CenterBelowLg}
              className="mt-4 max-w-[400px] sm:mt-5 lg:max-w-[324px]"
            >
              {FOOTER_DESCRIPTION}
            </Typography>
          </div>

          {/* Phones: two columns, an odd last one spans the row. Tablet: three. Desktop: joins the outer grid. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:contents">
            {FOOTER_COLUMNS.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className="min-w-0 max-sm:odd:last:col-span-2"
              >
                <Typography
                  as="h3"
                  variant={TypographyVariant.BodySm}
                  align={TypographyAlign.CenterBelowLg}
                  className="font-sans text-sm font-bold leading-[17px] lg:text-[13.5px]"
                >
                  {column.title}
                </Typography>
                <ul className="mt-3.5 flex flex-col gap-2.5 lg:mt-4 lg:gap-[11px]">
                  {column.links.map((link) => (
                    <li key={link.label} className="text-center lg:text-left">
                      <ActionElement
                        to={link.to}
                        href={link.href}
                        className="transition-colors hover:text-primary"
                      >
                        <Typography
                          as="span"
                          variant={TypographyVariant.Body}
                          tone={TypographyTone.Soft}
                          className="break-words text-[13.5px] leading-5 sm:text-[13.5px]"
                        >
                          {link.label}
                        </Typography>
                      </ActionElement>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-ink/9 pt-6 sm:mt-10 sm:pt-[27px] lg:flex-row lg:justify-between">
          <Typography
            variant={TypographyVariant.Caption}
            tone={TypographyTone.Soft}
            align={TypographyAlign.CenterBelowLg}
            className="font-sans"
          >
            {COPYRIGHT_TEXT}
          </Typography>
          <ul className="flex flex-wrap justify-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <li key={method}>
                <Chip size={ChipSize.Sm} className="h-8 px-3.5 text-xs font-semibold text-ink/70">
                  {method}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
