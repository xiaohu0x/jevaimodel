import { useCallback, useEffect, useRef, useState } from 'react'
import { LoaderCircle, Play } from 'lucide-react'
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
  DEFAULT_STATE,
  classify,
  uid,
  type Preset,
  type Question,
  type RunRecord,
} from '@/lib/engine'
import { useAccount } from '@/lib/useAccount'
import { cn } from '@/lib/utils'

const INITIAL_QUESTIONS: Question[] = [{ id: uid(), type: 'noul', question: '' }]

export default function Home() {
  const [state, setState] = useState(DEFAULT_STATE)
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [runs, setRuns] = useState<RunRecord[]>([])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [shared, setShared] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const account = useAccount()
  const runningRef = useRef(false)
  const resultRef = useRef<HTMLDivElement | null>(null)

  const loadPreset = useCallback((p: Preset) => {
    setState(p.state)
    setQuestions(p.questions.map((q) => ({ ...q, id: uid() })))
    setActivePreset(p.id)
    setRuns([])
  }, [])

  // Any hand edit means it is no longer that example.
  const editState = useCallback((v: string) => {
    setState(v)
    setActivePreset(null)
  }, [])

  const editQuestions = useCallback((qs: Question[]) => {
    setQuestions(qs)
    setActivePreset(null)
  }, [])

  const handleRun = useCallback(async () => {
    if (runningRef.current) return
    const qs = questions.filter((q) => q.question.trim())
    if (!qs.length) return

    // credits gate: silently enforced; when out of credits, ask to sign in
    if (!account.canRun) {
      setLoginOpen(true)
      return
    }

    runningRef.current = true
    setRunning(true)
    setProgress({ done: 0, total: qs.length })
    account.consumeRun()
    try {
      const record = await classify(qs, state, (done, total) => setProgress({ done, total }))
      setRuns((r) => [...r, record])
    } finally {
      runningRef.current = false
      setRunning(false)
      setProgress(null)
    }
  }, [questions, state, account])

  const handleClear = useCallback(() => {
    setState(DEFAULT_STATE)
    setQuestions([{ id: uid(), type: 'noul', question: '' }])
    setActivePreset(null)
    setRuns([])
  }, [])

  const handleShare = useCallback(() => {
    const payload = JSON.stringify({ state, questions }, null, 2)
    navigator.clipboard?.writeText(payload).catch(() => {})
    setShared(true)
    window.setTimeout(() => setShared(false), 1600)
  }, [state, questions])

  // Results render below the composer, so bring them into view after a run.
  useEffect(() => {
    if (!runs.length) return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [runs])

  // ⌘/Ctrl + Enter → Run
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
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

  const pending = questions.filter((q) => q.question.trim()).length
  const disabled = running || pending === 0

  return (
    <div className="flex min-h-screen flex-col bg-[#FEFEFE] text-zinc-900 antialiased">
      <Header
        user={account.user}
        onSignIn={() => setLoginOpen(true)}
        onSignOut={account.signOut}
        onShare={handleShare}
        shared={shared}
      />

      <main className="flex-1">
        {authError && (
          <div className="mx-auto w-full max-w-[1240px] px-4 pt-5 sm:px-8">
            <div className="flex items-center gap-3 rounded-xl border border-[#f386a1] bg-[#f386a1]/10 px-4 py-3">
              <span className="text-[14.5px] text-zinc-800">
                Couldn’t complete Google sign-in
                <span className="font-mono text-[12.5px] text-zinc-500"> ({authError})</span>. Please
                try again.
              </span>
              <button
                onClick={() => setAuthError(null)}
                className="ml-auto shrink-0 text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* console */}
        <section
          id="playground"
          className="mx-auto w-full max-w-[1240px] scroll-mt-16 px-4 pt-10 pb-14 sm:px-8 sm:pt-14"
        >
          <Hero />

          <div className="mt-11">
            <ExampleRail activeId={activePreset} onLoadPreset={loadPreset} />
          </div>

          {/* composer — context and questions side by side on desktop */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-900/15 bg-white shadow-[0_1px_2px_rgba(30,30,30,0.04),0_12px_32px_-12px_rgba(30,30,30,0.12)]">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              <div className="flex flex-col p-5 sm:p-7 lg:w-1/2 lg:border-r lg:border-zinc-200">
                <StateEditor value={state} onChange={editState} />
              </div>
              <div className="flex flex-col border-t border-zinc-200 p-5 sm:p-7 lg:w-1/2 lg:border-t-0">
                <QuestionsEditor questions={questions} onChange={editQuestions} />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
              <p className="hidden flex-1 text-[14px] text-zinc-400 sm:block">
                Questions are evaluated against the context
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleClear}
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-6 text-[15px] font-medium text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                >
                  Clear
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
                      {progress ? `Running ${progress.done}/${progress.total}` : 'Running'}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" strokeWidth={2} />
                      Run
                      <span className="hidden font-mono text-[12px] font-normal opacity-50 sm:inline">
                        ⌘↵
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* results — expand below the composer */}
          <div ref={resultRef} className={cn((running || runs.length) && 'scroll-mt-20 pt-10')}>
            <OutputPanel runs={runs} running={running} pendingQuestions={pending} />
          </div>
        </section>

        <FeatureRow />
        <Content />
        <Footer />
      </main>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGoogle={() => {
          setLoginOpen(false)
          account.signInWithGoogle()
        }}
      />
    </div>
  )
}
