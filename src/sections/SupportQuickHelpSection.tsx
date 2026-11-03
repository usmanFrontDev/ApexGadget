import { CallIcon, HoursIcon, MailIcon, WhatsAppIcon } from '@/components/icons'
import { SupportQuickCard } from '@/components/support/SupportQuickCard'
import { SUPPORT_CONTENT, SUPPORT_WHATSAPP_MESSAGE } from '@/constants/support'
import { useSupportInfo } from '@/hooks/useSupportContent'
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber'
import { buildWhatsAppUrl } from '@/lib/tradeInMessage'

export interface SupportQuickHelpSectionProps {
  /** Scrolls to the contact form ("Email us"). */
  onEmail: () => void
}

/** WhatsApp, call, email and business hours. A card without its data (no number / phone / hours configured) is left out. */
export function SupportQuickHelpSection({ onEmail }: SupportQuickHelpSectionProps) {
  const info = useSupportInfo().data
  const number = useWhatsAppNumber()
  const whatsappUrl = number ? buildWhatsAppUrl(number, SUPPORT_WHATSAPP_MESSAGE) : undefined
  const { quick } = SUPPORT_CONTENT

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {whatsappUrl && (
        <li>
          <SupportQuickCard icon={<WhatsAppIcon width={20} height={20} />} title={quick.whatsapp.title} text={quick.whatsapp.text} href={whatsappUrl} target="_blank" />
        </li>
      )}
      {info?.phone && (
        <li>
          <SupportQuickCard icon={<CallIcon width={20} height={20} />} title={quick.call.title} text={quick.call.text} href={`tel:${info.phone.replace(/[^\d+]/g, '')}`} />
        </li>
      )}
      <li>
        <SupportQuickCard icon={<MailIcon width={20} height={20} />} title={quick.email.title} text={quick.email.text} onClick={onEmail} />
      </li>
      {info?.hours && (
        <li>
          <SupportQuickCard icon={<HoursIcon width={20} height={20} />} title={quick.hours.title} text={info.hours} />
        </li>
      )}
    </ul>
  )
}
