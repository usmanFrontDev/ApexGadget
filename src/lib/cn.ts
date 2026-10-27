import clsx, { type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** Teach tailwind-merge our custom theme tokens so overrides resolve correctly. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-family': [{ font: ['body'] }],
      shadow: [
        {
          shadow: [
            'header',
            'glass-hero',
            'glass-promo',
            'glass-soft',
            'primary',
            'primary-soft',
            'newsletter',
            'banner',
            'ring',
            'ring-primary',
            'inset-glass',
            'inset-promo',
          ],
        },
      ],
    },
  },
})

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
