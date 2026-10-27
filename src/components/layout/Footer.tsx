import { Link } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import { Chip } from '@/components/ui/Chip'
import { Container } from '@/components/ui/Container'
import { ActionElement } from '@/components/ui/ActionElement'
import { COPYRIGHT_TEXT, FOOTER_COLUMNS, FOOTER_DESCRIPTION, PAYMENT_METHODS } from '@/constants/footer'
import { ROUTES } from '@/constants/routes'
import { ChipSize } from '@/constants/ui'

export function Footer() {
  return (
    <footer className="mt-12 pb-10 lg:mt-[85px]">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link to={ROUTES.home} aria-label="Apex Gadgets — home" className="inline-block">
              <img src={logo} alt="Apex Gadgets" width={80} height={32} className="h-[30px] w-auto" />
            </Link>
            <p className="mt-5 max-w-[324px] font-body text-[13.5px] leading-[18.7px] text-ink/70">
              {FOOTER_DESCRIPTION}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[13.5px] font-bold leading-[17px]">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-[11px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <ActionElement
                      to={link.to}
                      href={link.href}
                      className="break-words font-body text-[13.5px] leading-4 text-ink/66 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </ActionElement>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ink/9 pt-[27px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] leading-5 text-ink/66">{COPYRIGHT_TEXT}</p>
          <ul className="flex gap-2">
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
