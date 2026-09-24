import { useCallback, useEffect, useRef, useState } from 'react'
import { LoaderCircle, LogIn, Play } from 'lucide-react'
import Header from '@/sections/Header'
import Hero from '@/sections/Hero'
import ExampleRail from '@/sections/ExampleRail'
import StateEditor from '@/sections/StateEditor'
import QuestionsEditor from '@/sections/QuestionsEditor'
import OutputPanel from '@/sections/OutputPanel'
import FeatureRow from '@/sections/FeatureRow'
import Content from '@/sections/Content'
import Footer from '@/sections/Footer'
import LoginDialog from '@/sections/LoginDialog'
import {
  ClassifyError,
  DEFAULT_STATE,
  blankQuestion,
  classify,
  isQuestionReady,
  getRunError,
  uid,
  type Preset,
  type PrimitiveType,
  type Question,
} from '@/lib/engine'
import { LIMITS } from '../../shared/classification'
import { useDraft } from '@/lib/useDraft'
import { FEEDBACK } from '@/lib/feedback'
import { stateToFields } from '@/lib/state-fields'
import { useAccount } from '@/lib/useAccount'
import { formatMessage } from '@/lib/locale'
import { useLocale } from '@/lib/useLocale'
import { cn } from '@/lib/utils'

export default function Home() {
  const { locale, copy } = useLocale()
  const feedback = FEEDBACK[locale]
  const { state, questions, runs, setState, setQuestions, setRuns, ready: draftReady, storageError, persist } = useDraft()
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginWarning, setLoginWarning] = useState(false)
  const [shared, setShared] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const account = useAccount()
  const mounted = useRef(false)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  const requestRef = useRef<AbortController | null>(null)
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    requestRef.current?.abort()
    if (shareTimer.current) clearTimeout(shareTimer.current)
  }, [])
  const cancelRun = useCallback(() => {
    requestRef.current?.abort()
    requestRef.current = null
    setRunning(false)
    setRunError(null)
  }, [])
  const resultRef = useRef<HTMLDivElement | null>(null)
  const composerRef = useRef<HTMLDivElement | null>(null)

  const loadPreset = useCallback((p: Preset) => {
    cancelRun()
    setState(p.state)
    setQuestions(p.questions.map((q) => ({ ...q, id: uid() })))
    setActivePreset(p.id)
    setRuns([])
  }, [cancelRun, setState, setQuestions, setRuns])

  // Any hand edit means it is no longer that example.
  const editState = useCallback((v: string) => {
    setState(v)
    setActivePreset(null)
  }, [setState])

  const editQuestions = useCallback((qs: Question[]) => {
    setQuestions(qs)
    setActivePreset(null)
  }, [setQuestions])

  const handleRun = useCallback(async () => {
    if (requestRef.current || !draftReady || loginOpen) return
    const invalid = getRunError(questions, state)
    if (invalid) {
      setRunError(locale === 'en' ? invalid : feedback.input)
      return
    }

    if (account.loading) return
    if (!account.canRun) {
      if (!account.user && account.quota?.remaining === 0) {
        setRunError(null)
        setLoginOpen(true)
      } else if (account.cooldownSeconds > 0) {
        setRunError(`Please wait ${account.cooldownSeconds} seconds before running again.`)
      } else if (account.user && account.quota?.remaining === 0) {
        setRunError("You've used today's 30 runs. Come back tomorrow.")
      }
      return
    }

    const controller = new AbortController()
    requestRef.current = controller
    setRunning(true)
    setRunError(null)
    try {
      const record = await classify(questions, state, controller.signal)
      if (requestRef.current !== controller) return
      account.applyQuota(record.quota)
      setRuns([record])
    } catch (err) {
      if (controller.signal.aborted || requestRef.current !== controller) return
      if (err instanceof ClassifyError) {
        account.applyQuota(err.quota)
        if (err.code === 'LOGIN_REQUIRED') {
          setLoginOpen(true)
          return
        }
        if (err.code === 'RATE_LIMITED') {
          setRunError(
            formatMessage(copy.action.wait, {
              seconds: err.quota?.retryAfterSeconds ?? 10,
            }),
          )
          return
        }
        if (err.code === 'DAILY_LIMIT') {
          setRunError(copy.action.dailyDone)
          return
        }
      }
      setRunError(locale === 'en' && err instanceof ClassifyError ? err.message : copy.action.genericError)
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
        setRunning(false)
      }
      // A sent request may consume server allowance even when the browser cancels it.
      if (controller.signal.aborted && mounted.current) void account.refresh().catch(() => {})
    }
  }, [questions, state, account, copy, draftReady, loginOpen, locale, feedback.input, setRuns])

  const handleClear = useCallback(() => {
    cancelRun()
    setState(DEFAULT_STATE)
    setQuestions([])
    setActivePreset(null)
    setRuns([])
  }, [cancelRun, setState, setQuestions, setRuns])

  const addQuestionOfType = useCallback((t: PrimitiveType) => {
    setQuestions((qs) => qs.length < LIMITS.questions ? [...qs, blankQuestion(t)] : qs)
    setActivePreset(null)
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [setQuestions])

  const focusContext = useCallback(() => {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const handleShare = useCallback(async () => {
    setShared(false)
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(JSON.stringify({ state, questions }, null, 2))
      setShared(true)
      if (shareTimer.current) clearTimeout(shareTimer.current)
      shareTimer.current = setTimeout(() => setShared(false), 1600)
    } catch { setRunError(feedback.copy) }
  }, [state, questions, feedback.copy])

  // Results render below the composer, so bring them into view after a run.
  useEffect(() => {
    if (!runs.length) return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [runs])

  // ⌘/Ctrl + Enter → Run
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !document.querySelector('[role="dialog"], [role="alertdialog"]')) {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleRun])

  // Surface a failed Google sign-in and clean the URL.
  useEffect(() => {
    const url = new URL(window.location.href)
    const err = url.searchParams.get('auth_error')
    if (!err) return
    setAuthError(err)
    url.searchParams.delete('auth_error')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }, [])

  const contextKeys = (stateToFields(state) ?? []).map((f) => f.key).filter(Boolean)
  const pending = questions.filter(isQuestionReady).length
  const guestExhausted = !account.user && account.quota?.remaining === 0
  const dailyExhausted = Boolean(account.user && account.quota?.remaining === 0)
  const disabled =
    running ||
    !draftReady ||
    pending === 0 ||
    account.loading ||
    !account.quota ||
    account.cooldownSeconds > 0 ||
    dailyExhausted

  const allowanceLabel = account.loading
    ? copy.action.checking
    : account.cooldownSeconds > 0
      ? formatMessage(copy.action.readyIn, { seconds: account.cooldownSeconds })
      : account.quota
        ? account.user
          ? account.quota.remaining > 0
            ? formatMessage(copy.action.userRemaining, { count: account.quota.remaining })
            : copy.action.dailyDone
          : account.quota.remaining > 0
            ? formatMessage(copy.action.guestRemaining, { count: account.quota.remaining })
            : copy.action.signInContinue
        : copy.action.unavailable

  return (
    <div className="flex min-h-screen flex-col bg-[#FEFEFE] text-zinc-900 antialiased">
      <Header
        user={account.user}
        busy={account.busy || account.loading}
        onSignIn={() => { setLoginWarning(false); setLoginOpen(true) }}
        onSignOut={() => { cancelRun(); void account.signOut() }}
        onShare={handleShare}
        shared={shared}
      />

      <main className="flex-1">
        {(storageError || account.actionError) && (
          <p role="alert" className="mx-auto max-w-[1240px] px-4 pt-4 text-sm text-rose-700 sm:px-8">
            {storageError ? feedback.storage : locale === 'en' ? account.actionError : feedback.account}
          </p>
        )}
        {authError && (
          <div className="mx-auto w-full max-w-[1240px] px-4 pt-5 sm:px-8">
            <div className="flex items-center gap-3 rounded-xl border border-[#f386a1] bg-[#f386a1]/10 px-4 py-3">
              <span className="text-[14.5px] text-zinc-800">
                {copy.action.authError}
                <span className="font-mono text-[12.5px] text-zinc-500"> ({authError})</span>.{' '}
                {copy.action.tryAgain}
              </span>
              <button
                onClick={() => setAuthError(null)}
                className="ml-auto shrink-0 text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
              >
                {copy.action.dismiss}
              </button>
            </div>
          </div>
        )}

        {/* console */}
        <section
          id="playground"
          className="mx-auto w-full max-w-[1240px] scroll-mt-16 px-4 pt-5 pb-14 sm:px-8 sm:pt-7"
        >
          <Hero />

          <div className="mt-6 sm:mt-7">
            <ExampleRail activeId={activePreset} onLoadPreset={loadPreset} />
          </div>

          {/* composer — context and questions side by side on desktop.
              No overflow-hidden here: it would turn this card into a scroll
              container and break the sticky action bar below. */}
          <div
            ref={composerRef}
            className="mt-4 rounded-2xl border border-zinc-900/15 bg-white shadow-[0_1px_2px_rgba(30,30,30,0.04),0_12px_32px_-12px_rgba(30,30,30,0.12)]">
            <fieldset disabled={running || !draftReady} className="flex min-w-0 flex-col pb-16 lg:flex-row lg:items-stretch">
              <div className="flex flex-col p-4 sm:p-6 lg:w-1/2 lg:border-r lg:border-zinc-200">
                <StateEditor value={state} onChange={editState} />
              </div>
              <div className="flex flex-col border-t border-zinc-200 p-4 sm:p-6 lg:w-1/2 lg:border-t-0">
                <QuestionsEditor questions={questions} onChange={editQuestions} />
              </div>
            </fieldset>

            {/* action bar — sticks to the viewport bottom while the composer is
                in view, so Run stays reachable however tall the content grows */}
            <div className="sticky bottom-0 z-20 flex flex-col gap-3 rounded-b-2xl border-t border-zinc-200 bg-zinc-50/95 px-4 py-3.5 backdrop-blur sm:flex-row sm:items-center sm:px-6">
              <div className="flex-1 text-[13px] text-zinc-500 sm:text-[14px]">
                <p>{allowanceLabel}</p>
                {!account.loading && !account.quota && <button className="mt-1 underline" onClick={() => { void account.refresh().catch(() => {}) }}>{feedback.retry}</button>}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleClear}
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-6 text-[15px] font-medium text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                >
                  {copy.action.clear}
                </button>
                <button
                  onClick={handleRun}
                  disabled={disabled}
                  className={cn(
                    'btn-ink flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl px-8 text-[16px] font-semibold sm:flex-none',
                    disabled && 'pointer-events-none opacity-30',
                  )}
                >
                  {running ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.4} />
                      {copy.action.asking}
                    </>
                  ) : guestExhausted ? (
                    <>
                      <LogIn className="h-4 w-4" strokeWidth={2} />
                      {copy.action.signInContinue}
                    </>
                  ) : dailyExhausted ? (
                    <>{copy.action.dailyLimit}</>
                  ) : account.cooldownSeconds > 0 ? (
                    <>
                      {formatMessage(copy.action.readyIn, {
                        seconds: account.cooldownSeconds,
                      })}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" strokeWidth={2} />
                      {copy.action.run}
                      <span className="hidden font-mono text-[12px] font-normal opacity-50 sm:inline">
                        ⌘↵
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {runError && (
            <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-[#f386a1] bg-[#f386a1]/10 px-4 py-3">
              <span className="flex-1 text-[14.5px] leading-relaxed text-zinc-800">{runError}</span>
              <button
                onClick={() => setRunError(null)}
                className="shrink-0 text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
              >
                {copy.action.dismiss}
              </button>
            </div>
          )}

          {/* results — expand below the composer */}
          <div ref={resultRef} className={cn((running || runs.length) && 'scroll-mt-20 pt-10')}>
            <OutputPanel
              runs={runs}
              running={running}
              pendingQuestions={pending}
              contextKeys={contextKeys}
              onAddQuestion={addQuestionOfType}
              onFocusContext={focusContext}
            />
          </div>
        </section>

        <FeatureRow />
        <Content />
        <Footer />
      </main>

      <LoginDialog
        open={loginOpen}
        onClose={() => { setLoginOpen(false); setLoginWarning(false) }}
        warning={loginWarning ? feedback.storage : undefined}
        continueLabel={loginWarning ? feedback.continueUnsaved : undefined}
        onGoogle={() => {
          if (!persist() && !loginWarning) {
            setLoginWarning(true)
            return
          }
          account.signInWithGoogle()
        }}
      />
    </div>
  )
}
