import toast from 'react-hot-toast'
import { AppToast } from '@/components/ui/AppToast'
import { ToastVariant } from '@/constants/ui'

/** Id of the toast on screen: a new toast replaces it at once, so there is never more than one. */
let currentId: string | undefined

function show(variant: ToastVariant, title: string, text?: string) {
  if (currentId) toast.remove(currentId)
  currentId = toast.custom((item) => (
    <AppToast title={title} text={text} variant={variant} visible={item.visible} onClose={() => toast.dismiss(item.id)} />
  ))
}

/** Every toast of the app goes through here (title + optional text), so they all look alike. */
export const appToast = {
  success: (title: string, text?: string) => show(ToastVariant.Success, title, text),
  error: (title: string, text?: string) => show(ToastVariant.Error, title, text),
  info: (title: string, text?: string) => show(ToastVariant.Info, title, text),
}
