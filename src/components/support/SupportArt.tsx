import supportCardImage from '@/assets/images/SupportCard.png'
import { HeadsetIcon } from '@/components/icons'
import { GlassGlow } from '@/components/ui/GlassGlow'

/**
 * The headset illustration of the contact card. `SupportCard.png` is an opaque light picture: on the light theme it
 * is blended into the card, on the dark theme a glass tile with the same headset takes its place.
 */
export function SupportArt() {
  return (
    <>
      <img src={supportCardImage} alt="" width={1153} height={1364} loading="lazy" className="h-auto w-full max-w-[300px] mix-blend-multiply dark:hidden" />
      <div aria-hidden="true" className="group relative hidden aspect-square w-full max-w-[240px] place-items-center dark:grid">
        <GlassGlow className="inset-0 opacity-100" />
        <span className="relative grid size-32 place-items-center rounded-[32px] bg-surface/80 text-ink shadow-glass-promo backdrop-blur-md">
          <HeadsetIcon width={56} height={56} strokeWidth={1.3} />
          <span className="absolute -right-5 -top-4 grid h-9 w-14 place-items-center rounded-full bg-primary shadow-primary">
            <span className="flex gap-1">
              <span className="size-1.5 rounded-full bg-white" />
              <span className="size-1.5 rounded-full bg-white" />
              <span className="size-1.5 rounded-full bg-white" />
            </span>
          </span>
        </span>
      </div>
    </>
  )
}
