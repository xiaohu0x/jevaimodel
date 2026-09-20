import { useCallback, useEffect, useState } from 'react'

/**
 * Credits live entirely behind the scenes:
 * every visitor starts with 100 credits, one run costs 20.
 * The UI never exposes the credit balance — when credits run out,
 * the run action simply asks the user to sign in.
 */
const DEFAULT_CREDITS = 100
const COST_PER_RUN = 20

const CREDITS_KEY = 'classify.credits'
const USER_KEY = 'classify.user'

export interface AccountUser {
  email: string
  name: string
}

function readCredits(): number {
  try {
    const raw = localStorage.getItem(CREDITS_KEY)
    if (raw === null) return DEFAULT_CREDITS
    const n = Number(raw)
    return Number.isFinite(n) ? n : DEFAULT_CREDITS
  } catch {
    return DEFAULT_CREDITS
  }
}

function readUser(): AccountUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AccountUser) : null
  } catch {
    return null
  }
}

export function useAccount() {
  const [credits, setCredits] = useState<number>(readCredits)
  const [user, setUser] = useState<AccountUser | null>(readUser)
  // session activity counter (display-only, no quota semantics)
  const [runsThisSession, setRunsThisSession] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(CREDITS_KEY, String(credits))
    } catch {
      /* ignore */
    }
  }, [credits])

  const canRun = user !== null || credits >= COST_PER_RUN

  const consumeRun = useCallback(() => {
    setCredits((c) => Math.max(0, c - COST_PER_RUN))
    setRunsThisSession((n) => n + 1)
  }, [])

  const signIn = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[._-]+/g, ' ').trim() || 'User'
    const u = { email, name: name.replace(/\b\w/g, (c) => c.toUpperCase()) }
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    } catch {
      /* ignore */
    }
    setUser(u)
  }, [])

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY)
    } catch {
      /* ignore */
    }
    setUser(null)
  }, [])

  return { canRun, user, runsThisSession, consumeRun, signIn, signOut }
}
