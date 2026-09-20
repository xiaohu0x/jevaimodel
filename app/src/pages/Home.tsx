import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar, { type NavKey } from '@/sections/Sidebar'
import TopBar from '@/sections/TopBar'
import StateEditor from '@/sections/StateEditor'
import QuestionsEditor from '@/sections/QuestionsEditor'
import OutputPanel from '@/sections/OutputPanel'
import LoginDialog from '@/sections/LoginDialog'
import { DocsPage, HomePage, UsagePage } from '@/sections/pages'
import {
  DEFAULT_STATE,
  classify,
  uid,
  type Preset,
  type Question,
  type RunRecord,
} from '@/lib/engine'
import { useAccount } from '@/lib/useAccount'

const INITIAL_QUESTIONS: Question[] = [{ id: uid(), type: 'noul', question: '' }]

export default function Home() {
  const [nav, setNav] = useState<NavKey>('playground')
  const [state, setState] = useState(DEFAULT_STATE)
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [runs, setRuns] = useState<RunRecord[]>([])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)

  const account = useAccount()
  const runningRef = useRef(false)

  const loadPreset = useCallback((p: Preset) => {
    setState(p.state)
    setQuestions(p.questions.map((q) => ({ ...q, id: uid() })))
    setNav('playground')
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
  }, [])

  // ⌘/Ctrl + Enter → Run
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && nav === 'playground') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleRun, nav])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FBFBFA] text-zinc-900 antialiased">
      <Sidebar active={nav} onNavigate={setNav} user={account.user} onSignOut={account.signOut} />

      <main className="flex min-w-0 flex-1 flex-col">
        {nav === 'playground' ? (
          <>
            <TopBar
              running={running}
              progress={progress}
              questionCount={questions.filter((q) => q.question.trim()).length}
              onRun={handleRun}
              onClear={handleClear}
            />
            <div className="flex min-h-0 flex-1">
              {/* left: editors */}
              <div className="flex w-[46%] min-w-[400px] shrink-0 flex-col gap-5 overflow-hidden border-r border-zinc-950/[0.06] p-5">
                <StateEditor value={state} onChange={setState} />
                <QuestionsEditor questions={questions} onChange={setQuestions} />
              </div>
              {/* right: output */}
              <div className="min-w-0 flex-1 bg-white">
                <OutputPanel
                  runs={runs}
                  running={running}
                  pendingQuestions={questions.filter((q) => q.question.trim()).length}
                  onLoadPreset={loadPreset}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            {nav === 'home' && (
              <HomePage
                user={account.user}
                runs={runs}
                onOpenPlayground={() => setNav('playground')}
              />
            )}
            {nav === 'usage' && <UsagePage runs={runs} />}
            {nav === 'docs' && <DocsPage />}
          </div>
        )}
      </main>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignIn={(email) => {
          account.signIn(email)
          setLoginOpen(false)
        }}
      />
    </div>
  )
}
