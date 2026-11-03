import type { ComponentType } from 'react'
import { HeadsetIcon, HelpCircleIcon, ShieldIcon, TruckIcon, type IconProps } from '@/components/icons'
import { FilterChip } from '@/components/ui/FilterChip'
import { PillRow } from '@/components/ui/PillRow'
import { SUPPORT_TABS, SupportIconKey, type SupportSectionId } from '@/constants/support'

const ICONS: Record<SupportIconKey, ComponentType<IconProps>> = {
  [SupportIconKey.Headset]: HeadsetIcon,
  [SupportIconKey.Truck]: TruckIcon,
  [SupportIconKey.Shield]: ShieldIcon,
  [SupportIconKey.Help]: HelpCircleIcon,
}

export interface SupportTabsProps {
  active: SupportSectionId
  onSelect: (id: SupportSectionId) => void
}

/** Section tabs under the banner (the shop's pill row): the active one follows the scroll, a click scrolls to the section. */
export function SupportTabs({ active, onSelect }: SupportTabsProps) {
  return (
    <PillRow label="Support sections">
      {SUPPORT_TABS.map((tab) => {
        const Icon = ICONS[tab.icon]
        return (
          <FilterChip key={tab.id} toggle={false} selected={active === tab.id} icon={<Icon width={16} height={16} />} onClick={(event) => {
              // A mouse click must not leave the keyboard focus ring on the pill (keyboard users keep their focus).
              if (event.detail > 0) event.currentTarget.blur()
              onSelect(tab.id)
            }}>
            {tab.label}
          </FilterChip>
        )
      })}
    </PillRow>
  )
}
