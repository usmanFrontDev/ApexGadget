import { z } from 'zod'
import { CONTACT_LIMITS, CONTACT_PHONE_PATTERN, CONTACT_TOPICS, SUPPORT_CONTENT } from '@/constants/support'

const { errors } = SUPPORT_CONTENT.form

export const contactSchema = z.object({
  name: z.string().trim().min(CONTACT_LIMITS.nameMin, errors.name).max(CONTACT_LIMITS.nameMax, errors.name),
  email: z.string().trim().max(CONTACT_LIMITS.emailMax, errors.email).pipe(z.email(errors.email)),
  /** Optional: empty or a phone-like value. */
  phone: z.string().trim().refine((value) => value === '' || CONTACT_PHONE_PATTERN.test(value), errors.phone),
  /** Optional (the design has no asterisk). */
  topic: z.enum(CONTACT_TOPICS.map((topic) => topic.value) as [string, ...string[]]).optional(),
  message: z.string().trim().min(CONTACT_LIMITS.messageMin, errors.message).max(CONTACT_LIMITS.messageMax, errors.messageMax),
  /** Honeypot: people never see it, bots fill it. A filled value is dropped silently. */
  website: z.string().max(200).optional(),
})

export type ContactValues = z.infer<typeof contactSchema>
