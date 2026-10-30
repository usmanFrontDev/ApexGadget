import type { ComponentType } from 'react'
import { BankIcon, CashIcon, WalletIcon, type IconProps } from '@/components/icons'
import { Typography } from '@/components/ui/Typography'
import { ACCEPTED_PAYMENTS, CART_CONTENT, PaymentIconKey } from '@/constants/cart'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

const ICONS: Record<PaymentIconKey, ComponentType<IconProps>> = {
  [PaymentIconKey.Cash]: CashIcon,
  [PaymentIconKey.Bank]: BankIcon,
  [PaymentIconKey.Wallet]: WalletIcon,
}

/** "Accepted Payments": text chips with a generic icon (the client supplies logos later: `ACCEPTED_PAYMENTS[].logo`). */
export function PaymentMethods() {
  return (
    <section aria-labelledby="accepted-payments">
      <Typography as="h3" id="accepted-payments" variant={TypographyVariant.BodySm} tone={TypographyTone.Soft} align={TypographyAlign.CenterBelowLg} className="font-sans font-semibold">
        {CART_CONTENT.summary.payments}
      </Typography>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {ACCEPTED_PAYMENTS.map((method) => {
          const Icon = ICONS[method.icon]
          return (
            <li key={method.id} className="flex min-w-0 flex-col items-center gap-1.5 rounded-[14px] bg-white/80 px-1 py-2.5 shadow-ring">
              {method.logo ? (
                <img src={method.logo} alt="" className="h-5 w-auto object-contain" />
              ) : (
                <Icon width={20} height={20} className="shrink-0 text-ink/70" />
              )}
              <Typography as="span" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.Center} className="max-w-full text-[11px] leading-[14px]">
                {method.label}
              </Typography>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
