import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { describedByFor } from '@/components/form/fieldIds'
import { FormField } from '@/components/form/FormField'
import { TextArea } from '@/components/form/TextArea'
import { TextInput } from '@/components/form/TextInput'
import { ArrowUpRightIcon, CheckIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Typography } from '@/components/ui/Typography'
import { CONTACT_LIMITS, CONTACT_TOPICS, SUPPORT_CONTENT } from '@/constants/support'
import { ButtonSize, ButtonVariant, IconAnimation, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useSendContactMessage } from '@/hooks/useSendContactMessage'
import { contactSchema, type ContactValues } from '@/lib/schemas/contact.schema'

const IDS = { name: 'contact-name', email: 'contact-email', phone: 'contact-phone', topic: 'contact-topic', message: 'contact-message' } as const

/** Support contact form (React Hook Form + Zod). Errors are inline under each field; a success view replaces the form. */
export function ContactForm() {
  const { form: copy } = SUPPORT_CONTENT
  const [sent, setSent] = useState(false)
  const send = useSendContactMessage()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '', website: '' },
  })
  const message = useWatch({ control, name: 'message' }) ?? ''

  if (sent) {
    return (
      <div className="flex flex-col items-center py-6 text-center" role="status">
        <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 shadow-ring">
          <CheckIcon width={22} height={22} />
        </span>
        <Typography variant={TypographyVariant.Subtitle} className="mt-4">
          {copy.success.title}
        </Typography>
        <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.Center} className="mt-2 max-w-[360px]">
          {copy.success.text}
        </Typography>
        <Button variant={ButtonVariant.Secondary} size={ButtonSize.Md} onClick={() => setSent(false)} className="mt-6">
          {copy.success.again}
        </Button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        send.mutate(values, {
          onSuccess: () => {
            reset()
            setSent(true)
          },
        }),
      )}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={IDS.name} label={copy.name} error={errors.name?.message}>
          <TextInput
            id={IDS.name}
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            invalid={Boolean(errors.name)}
            aria-describedby={describedByFor(IDS.name, { error: errors.name?.message })}
            {...register('name')}
          />
        </FormField>
        <FormField id={IDS.email} label={copy.email} error={errors.email?.message}>
          <TextInput
            id={IDS.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.emailPlaceholder}
            invalid={Boolean(errors.email)}
            aria-describedby={describedByFor(IDS.email, { error: errors.email?.message })}
            {...register('email')}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={IDS.phone} label={copy.phone} suffix={copy.phoneSuffix} error={errors.phone?.message}>
          <TextInput
            id={IDS.phone}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={copy.phonePlaceholder}
            invalid={Boolean(errors.phone)}
            aria-describedby={describedByFor(IDS.phone, { error: errors.phone?.message })}
            {...register('phone')}
          />
        </FormField>
        <FormField id={IDS.topic} label={copy.topic} error={errors.topic?.message}>
          <Controller
            control={control}
            name="topic"
            render={({ field }) => (
              <SelectMenu
                field
                id={IDS.topic}
                label={copy.topic}
                showLabel={false}
                placeholder={copy.topicPlaceholder}
                options={CONTACT_TOPICS}
                value={(field.value ?? '') as (typeof CONTACT_TOPICS)[number]['value'] | ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                triggerRef={field.ref}
                invalid={Boolean(errors.topic)}
                describedBy={describedByFor(IDS.topic, { error: errors.topic?.message })}
              />
            )}
          />
        </FormField>
      </div>

      <FormField id={IDS.message} label={copy.message} error={errors.message?.message}>
        <TextArea
          id={IDS.message}
          rows={5}
          maxLength={CONTACT_LIMITS.messageMax}
          placeholder={copy.messagePlaceholder}
          invalid={Boolean(errors.message)}
          aria-describedby={describedByFor(IDS.message, { error: errors.message?.message })}
          {...register('message')}
        />
        <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-1.5 text-right tabular-nums">
          {copy.counter.replace('{n}', String(message.length)).replace('{max}', String(CONTACT_LIMITS.messageMax))}
        </Typography>
      </FormField>

      {/* Honeypot: invisible to people (and to assistive tech), bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <Button
        type="submit"
        size={ButtonSize.Lg}
        icon={<ArrowUpRightIcon />}
        iconAnimation={IconAnimation.PointRight}
        disabled={send.isPending}
        blockOnMobile
        className="sm:self-start"
      >
        {send.isPending ? copy.sending : copy.submit}
      </Button>
    </form>
  )
}
