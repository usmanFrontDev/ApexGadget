import { useMutation } from '@tanstack/react-query'
import { supportKeys } from '@/constants/queryKeys'
import { SUPPORT_CONTENT } from '@/constants/support'
import { appToast } from '@/lib/appToast'
import type { ContactValues } from '@/lib/schemas/contact.schema'
import { sendContactMessage } from '@/services/contact.service'
import { ContactError, ContactErrorCode } from '@/types/support.types'

/** Send the Support contact form. Success is shown by the form itself; failures toast here. */
export function useSendContactMessage() {
  return useMutation({
    mutationKey: supportKeys.contact(),
    mutationFn: (values: ContactValues) => sendContactMessage(values),
    onError: (error) => {
      const { failed, notConfigured } = SUPPORT_CONTENT.form
      const copy = error instanceof ContactError && error.code === ContactErrorCode.NotConfigured ? notConfigured : failed
      appToast.error(copy.title, copy.text)
    },
  })
}
