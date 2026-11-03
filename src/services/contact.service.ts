import { CONTACT_TOPICS } from '@/constants/support'
import { EMAILJS_CONFIG } from '@/lib/env'
import type { ContactValues } from '@/lib/schemas/contact.schema'
import { ContactError, ContactErrorCode } from '@/types/support.types'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

/**
 * Sends the Support contact form through EmailJS' REST API (no library, no backend: the keys are public by design, the
 * recipient lives in the EmailJS template). Template variables: from_name, reply_to, phone, topic, message, page_url.
 */
export async function sendContactMessage(values: ContactValues): Promise<void> {
  // Honeypot: pretend it worked, send nothing.
  if (values.website) return
  if (!EMAILJS_CONFIG) throw new ContactError(ContactErrorCode.NotConfigured, 'The contact form is not connected yet.')

  const topic = CONTACT_TOPICS.find((item) => item.value === values.topic)?.label ?? '-'
  let response: Response
  try {
    response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
        template_params: {
          from_name: values.name,
          reply_to: values.email,
          phone: values.phone || '-',
          topic,
          message: values.message,
          page_url: window.location.href,
        },
      }),
    })
  } catch {
    throw new ContactError(ContactErrorCode.Failed, 'Network error.')
  }
  if (!response.ok) throw new ContactError(ContactErrorCode.Failed, 'The message could not be sent.')
}
