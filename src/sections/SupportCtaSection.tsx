import { WhatsAppIcon } from '@/components/icons'
import { CtaBanner } from '@/components/common/CtaBanner'
import { SUPPORT_CONTENT, SUPPORT_WHATSAPP_MESSAGE, SupportSectionId } from '@/constants/support'
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber'
import { buildWhatsAppUrl } from '@/lib/tradeInMessage'

/** "Jawab nahi mila?": a WhatsApp link (the contact form when no number is configured). */
export function SupportCtaSection() {
  const number = useWhatsAppNumber()
  const url = number ? buildWhatsAppUrl(number, SUPPORT_WHATSAPP_MESSAGE) : undefined
  const { cta } = SUPPORT_CONTENT

  return (
    <CtaBanner
      title={cta.title}
      description={cta.text}
      href={url ?? `#${SupportSectionId.Contact}`}
      target={url ? '_blank' : undefined}
      icon={<WhatsAppIcon width={18} height={18} />}
      className="mt-6 sm:mt-8"
    />
  )
}
