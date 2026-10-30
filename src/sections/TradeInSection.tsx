import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form'
import { appToast } from '@/lib/appToast'
import { useLocation, useNavigate } from 'react-router-dom'
import { Stepper } from '@/components/form/Stepper'
import { ArrowUpRightIcon, ReturnIcon, WhatsAppIcon } from '@/components/icons'
import { TradeInConditionStep } from '@/components/trade/TradeInConditionStep'
import { TradeInPhoneStep } from '@/components/trade/TradeInPhoneStep'
import { TradeInReviewStep } from '@/components/trade/TradeInReviewStep'
import { TradeInSidebar } from '@/components/trade/TradeInSidebar'
import { TradeInSuccess } from '@/components/trade/TradeInSuccess'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { ROUTES } from '@/constants/routes'
import {
  DEFAULT_TRADE_IN_BODY,
  DEFAULT_TRADE_IN_SCREEN,
  TRADE_IN_CONTENT,
  TRADE_IN_FORM_ID,
  TRADE_IN_STEPS,
  TradeInStep,
} from '@/constants/trade'
import {
  ButtonSize,
  ButtonVariant,
  GlassCardVariant,
  IconAnimation,
  IconPosition,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { clearTradeInDraft, loadTradeInDraft, useTradeInDraft } from '@/hooks/useTradeInDraft'
import { useTradeInSettings } from '@/hooks/useTradeInSettings'
import { TRADE_IN_STEP_FIELDS, tradeInSchema, type TradeInValues } from '@/lib/schemas/tradeIn.schema'
import { buildTradeInMessage, buildWhatsAppUrl } from '@/lib/tradeInMessage'

/** Nothing is preselected except the "No issues" defaults: identity fields are a deliberate choice. */
const EMPTY_VALUES = {
  model: '',
  storage: '',
  colour: '',
  ptaStatus: '',
  condition: '',
  screen: DEFAULT_TRADE_IN_SCREEN,
  body: DEFAULT_TRADE_IN_BODY,
  batteryHealth: undefined,
  notes: '',
  name: '',
  wantToBuy: undefined,
} as unknown as DefaultValues<TradeInValues>

const HEADING_ID = 'trade-in-step-heading'

/** The 3-step form, its desktop sidebar and the success state. Everything ends in a pre-filled WhatsApp message. */
export function TradeInSection() {
  const [draft] = useState(loadTradeInDraft)
  const [step, setStep] = useState<TradeInStep>(draft?.step ?? TradeInStep.Phone)
  const [showErrors, setShowErrors] = useState(false)
  const [sentUrl, setSentUrl] = useState<string | null>(null)
  const headingRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)
  const navigate = useNavigate()
  const location = useLocation()
  const settings = useTradeInSettings()

  const form = useForm<TradeInValues>({
    resolver: zodResolver(tradeInSchema),
    mode: 'onTouched',
    defaultValues: { ...EMPTY_VALUES, ...draft?.values },
  })
  const { errors } = form.formState
  const sent = sentUrl !== null
  useTradeInDraft(form, step, !sent)

  // Move focus to the step heading whenever the step (or the success state) changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step, sent])

  const fields = TRADE_IN_STEP_FIELDS[step]
  const messages = showErrors
    ? [...new Set(fields.map((field) => errors[field]?.message).filter((message): message is string => Boolean(message)))]
    : []

  const goToStep = (next: TradeInStep) => {
    setShowErrors(false)
    setStep(next)
  }

  const next = async () => {
    const valid = await form.trigger([...fields])
    if (valid) {
      goToStep((step + 1) as TradeInStep)
      return
    }
    setShowErrors(true)
    const firstInvalid = fields.find((field) => form.getFieldState(field).error)
    if (firstInvalid) form.setFocus(firstInvalid)
  }

  const number = settings.data?.whatsappNumber ?? ''
  const numberMissing = settings.isSuccess && !number

  const send = form.handleSubmit(
    (values) => {
      const url = buildWhatsAppUrl(number, buildTradeInMessage(values, settings.data?.messageTemplate ?? ''))
      if (!url) return
      // May be blocked after the async validation on some phones: the success screen has a real link as the fallback.
      window.open(url, '_blank', 'noopener,noreferrer')
      appToast.success(TRADE_IN_CONTENT.success.toast)
      clearTradeInDraft()
      form.reset(EMPTY_VALUES)
      setShowErrors(false)
      setStep(TradeInStep.Phone)
      setSentUrl(url)
    },
    () => {
      setShowErrors(true)
      const firstInvalid = fields.find((field) => form.getFieldState(field).error)
      if (firstInvalid) form.setFocus(firstInvalid)
    },
  )

  /** Fresh start: empties every field and the saved draft, back to step 1. */
  const clearAll = () => {
    form.reset(EMPTY_VALUES)
    clearTradeInDraft()
    goToStep(TradeInStep.Phone)
    appToast.info(TRADE_IN_CONTENT.cleared)
  }

  const cancel = () => {
    form.reset(EMPTY_VALUES)
    clearTradeInDraft()
    goToStep(TradeInStep.Phone)
    // `default` = this page was the first entry of the session: there is no "back" to go to.
    if (location.key === 'default') navigate(ROUTES.home)
    else navigate(-1)
  }

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step === TradeInStep.Review) void send()
    else void next()
  }

  const current = TRADE_IN_STEPS.find((item) => item.id === step) ?? TRADE_IN_STEPS[0]
  const { buttons } = TRADE_IN_CONTENT

  return (
    <FormProvider {...form}>
      <section
        id={TRADE_IN_FORM_ID}
        aria-label="Trade-in form"
        className="mt-6 grid scroll-mt-28 gap-4 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6"
      >
        <GlassCard variant={GlassCardVariant.Hero} className="p-4 sm:p-7">
          {sent ? (
            <TradeInSuccess whatsAppUrl={sentUrl} headingRef={headingRef} />
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <Stepper
                steps={TRADE_IN_STEPS}
                current={step}
                onStepClick={(id) => goToStep(id as TradeInStep)}
              />

              <div className="mt-5 rounded-[22px] bg-white/55 p-4 shadow-ring sm:p-7">
                <Typography
                  ref={headingRef}
                  id={HEADING_ID}
                  tabIndex={-1}
                  as="h2"
                  variant={TypographyVariant.Subtitle}
                  className="outline-none"
                >
                  {current.title}
                </Typography>
                <Typography variant={TypographyVariant.BodySm} tone={TypographyTone.Muted} className="mt-1">
                  {current.subtitle}
                </Typography>

                {/* The errors are shown under each field; this only tells screen readers how many there are. */}
                <p role="status" aria-live="assertive" className="sr-only">
                  {messages.length > 0 ? TRADE_IN_CONTENT.errorsAnnouncement.replace('{n}', String(messages.length)) : ''}
                </p>

                <div className="mt-5">
                  {step === TradeInStep.Phone && <TradeInPhoneStep />}
                  {step === TradeInStep.Condition && <TradeInConditionStep />}
                  {step === TradeInStep.Review && <TradeInReviewStep onEdit={() => goToStep(TradeInStep.Phone)} />}
                </div>

                {step === TradeInStep.Review && numberMissing && (
                  <p role="alert" className="mt-5 rounded-2xl bg-primary/8 px-4 py-3 text-[13px] font-semibold text-primary shadow-ring-primary">
                    {TRADE_IN_CONTENT.noNumber}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {step === TradeInStep.Phone ? (
                    <Button
                      type="button"
                      variant={ButtonVariant.Secondary}
                      size={ButtonSize.Lg}
                      onClick={cancel}
                      className="max-sm:hidden"
                    >
                      {buttons.cancel}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant={ButtonVariant.Secondary}
                      size={ButtonSize.Lg}
                      onClick={() => goToStep((step - 1) as TradeInStep)}
                      className="max-sm:w-full"
                    >
                      {buttons.back}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={ButtonVariant.Secondary}
                    size={ButtonSize.Lg}
                    icon={<ReturnIcon width={16} height={16} />}
                    iconPosition={IconPosition.Start}
                    onClick={clearAll}
                    className="max-sm:w-full"
                  >
                    {buttons.clear}
                  </Button>
                </div>

                {step === TradeInStep.Review ? (
                  <Button
                    type="submit"
                    size={ButtonSize.Lg}
                    icon={<WhatsAppIcon width={17} height={17} />}
                    disabled={settings.isPending || numberMissing || form.formState.isSubmitting}
                    blockOnMobile
                  >
                    {buttons.send}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size={ButtonSize.Lg}
                    icon={<ArrowUpRightIcon />}
                    iconAnimation={IconAnimation.PointRight}
                    blockOnMobile
                  >
                    {buttons.next}
                  </Button>
                )}
              </div>
            </form>
          )}
        </GlassCard>

        <div className="hidden lg:block">
          <TradeInSidebar />
        </div>
      </section>
    </FormProvider>
  )
}
