import { useState } from 'react'
import { TextArea } from '@/components/form/TextArea'
import { NoteIcon } from '@/components/icons'
import { CollapsibleRow } from '@/components/ui/CollapsibleRow'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT, CART_NOTE_MAX, CART_NOTE_SAVE_DELAY_MS } from '@/constants/cart'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useUpdateCartNote } from '@/hooks/useCartMutations'
import { useDebouncedCommit } from '@/hooks/useDebouncedCommit'

export interface DeliveryNoteProps {
  /** The note saved on the cart (restored on reload). */
  savedNote: string
}

/** Collapsible "Add a note for delivery": a counted textarea saved to the cart note ~600 ms after typing stops. */
export function DeliveryNote({ savedNote }: DeliveryNoteProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(savedNote)
  const [syncedNote, setSyncedNote] = useState(savedNote)
  const updateNote = useUpdateCartNote()

  // The saved note changed elsewhere (another tab, a refetch): adopt it, unless it is just our own save coming back.
  if (savedNote !== syncedNote) {
    setSyncedNote(savedNote)
    if (savedNote !== draft.trim() && savedNote !== draft) setDraft(savedNote)
  }

  useDebouncedCommit(draft, (note) => updateNote.mutate(note), CART_NOTE_SAVE_DELAY_MS)

  return (
    <CollapsibleRow
      label={CART_CONTENT.note.toggle}
      icon={<NoteIcon width={18} height={18} />}
      open={open}
      onOpenChange={setOpen}
    >
      <label htmlFor="delivery-note" className="sr-only">
        {CART_CONTENT.note.label}
      </label>
      <TextArea
        id="delivery-note"
        value={draft}
        maxLength={CART_NOTE_MAX}
        placeholder={CART_CONTENT.note.placeholder}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.Start} className="mt-1.5 text-right tabular-nums">
        {CART_CONTENT.note.counter.replace('{n}', String(draft.length)).replace('{max}', String(CART_NOTE_MAX))}
      </Typography>
    </CollapsibleRow>
  )
}
