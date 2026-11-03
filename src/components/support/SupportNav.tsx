import { Button } from '@/components/ui/Button'
import { SUPPORT_NAV } from '@/constants/support'
import { ButtonSize, ButtonVariant } from '@/constants/ui'

/** Jump links to the sections of the Support page (the same targets as the footer links). */
export function SupportNav() {
  return (
    <nav aria-label="Support sections" className="flex flex-wrap justify-center gap-2 lg:justify-start">
      {SUPPORT_NAV.map((item) => (
        <Button key={item.id} href={`#${item.id}`} variant={ButtonVariant.Secondary} size={ButtonSize.Xs}>
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
