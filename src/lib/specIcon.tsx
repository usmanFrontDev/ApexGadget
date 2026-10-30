import type { ComponentType } from 'react'
import { CameraIcon, ChipIcon, DesignIcon, DisplayIcon, InfoIcon, type IconProps } from '@/components/icons'

const ICONS: readonly { test: RegExp; icon: ComponentType<IconProps> }[] = [
  { test: /display|screen/i, icon: DisplayIcon },
  { test: /chip|processor|cpu/i, icon: ChipIcon },
  { test: /camera|photo/i, icon: CameraIcon },
  { test: /design|body|build|material|titanium/i, icon: DesignIcon },
]

/** Icon of a spec by keywords in its label; unknown labels get a generic info icon. */
export function getSpecIcon(label: string): ComponentType<IconProps> {
  return ICONS.find((entry) => entry.test.test(label))?.icon ?? InfoIcon
}
