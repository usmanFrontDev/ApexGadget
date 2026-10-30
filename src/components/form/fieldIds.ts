export const fieldErrorId = (id: string) => `${id}-error`
export const fieldHintId = (id: string) => `${id}-hint`
export const fieldLabelId = (id: string) => `${id}-label`

/** `aria-describedby` for a control: the error when there is one, else the hint. */
export const describedByFor = (id: string, { hint, error }: { hint?: string; error?: string }) =>
  error ? fieldErrorId(id) : hint ? fieldHintId(id) : undefined
