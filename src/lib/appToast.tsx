import toast from 'react-hot-toast'
import { AppToast } from '@/components/ui/AppToast'
import { ToastVariant } from '@/constants/ui'

function show(variant: ToastVariant, title: string, text?: string) {
  toast.custom((item) => (
    <AppToast title={title} text={text} variant={variant} visible={item.visible} onClose={() => toast.dismiss(item.id)} />
  ))
}

/** Every toast of the app goes through here (title + optional text), so they all look alike. */
export const appToast = {
  success: (title: string, text?: string) => show(ToastVariant.Success, title, text),
  error: (title: string, text?: string) => show(ToastVariant.Error, title, text),
  info: (title: string, text?: string) => show(ToastVariant.Info, title, text),
}
