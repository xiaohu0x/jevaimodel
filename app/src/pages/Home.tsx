import { useCallback, useEffect, useRef, useState } from 'react'
import { LoaderCircle, Play } from 'lucide-react'
import Header from '@/sections/Header'
import Hero from '@/sections/Hero'
import StateEditor from '@/sections/StateEditor'
import QuestionsEditor from '@/sections/QuestionsEditor'
import OutputPanel from '@/sections/OutputPanel'
import Content from '@/sections/Content'
import Footer from '@/sections/Footer'
import LoginDialog from '@/sections/LoginDialog'
import DocsDialog from '@/sections/DocsDialog'
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
  const [runs, setRuns] = useState<RunRecord[]>([])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [shared, setShared] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const account = useAccount()
  const runningRef = useRef(false)

  const loadPreset = useCallback((p: Preset) => {
    setState(p.state)
    setQuestions(p.questions.map((q) => ({ ...q, id: uid() })))
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
    setRuns([])
  }, [])

  const handleShare = useCallback(() => {
    const payload = JSON.stringify({ state, questions }, null, 2)
    navigator.clipboard?.writeText(payload).catch(() => {})
    setShared(true)
    window.setTimeout(() => setShared(false), 1600)
  }, [state, questions])

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
        onDocs={() => setDocsOpen(true)}
        onShare={handleShare}
        shared={shared}
      />

      <main className="flex-1">
        {authError && (
          <div className="mx-auto w-full max-w-[820px] px-4 pt-5 sm:px-6">
            <div className="flex items-center gap-3 rounded-xl border border-[#f386a1] bg-[#f386a1]/10 px-3.5 py-2.5">
              <span className="text-[12.5px] text-zinc-800">
                Couldn’t complete Google sign-in
                <span className="font-mono text-[11px] text-zinc-500"> ({authError})</span>. Please
                try again.
              </span>
              <button
                onClick={() => setAuthError(null)}
                className="ml-auto shrink-0 text-[11.5px] font-medium text-zinc-500 hover:text-zinc-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <Hero />

        {/* console */}
        <section id="playground" className="scroll-mt-16 border-b border-zinc-200/70">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {/* editor column */}
            <div className="flex flex-col border-zinc-200 lg:w-[52%] lg:min-w-[480px] lg:max-w-[760px] lg:border-r">
              <div className="flex-1 space-y-6 px-4 py-5 sm:px-6 lg:py-7">
                <StateEditor value={state} onChange={setState} />
                <QuestionsEditor questions={questions} onChange={setQuestions} />
              </div>

              {/* action bar — always within thumb reach */}
              <div className="sticky bottom-0 z-20 shrink-0 border-t border-zinc-200 bg-[#FEFEFE]/95 px-4 py-3.5 backdrop-blur sm:px-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRun}
                    disabled={disabled}
                    className={cn(
                      'btn-ink flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold',
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
                        <Play className="h-3.5 w-3.5 fill-current" strokeWidth={2} />
                        Run
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClear}
                    className="h-11 rounded-xl border border-zinc-300 bg-white px-5 text-[13px] font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
                  >
                    Clear
                  </button>
                </div>
                <p className="mt-2 hidden text-center text-[11px] text-zinc-400 sm:block">
                  Press ⌘↵ to run — questions are evaluated against the state above
                </p>
              </div>
            </div>

            {/* output column */}
            <div className="flex-1">
              <OutputPanel
                runs={runs}
                running={running}
                pendingQuestions={pending}
                onLoadPreset={loadPreset}
              />
            </div>
          </div>
        </section>

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

      <DocsDialog open={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  )
}
