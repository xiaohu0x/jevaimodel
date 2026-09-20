import { useCallback, useEffect, useState } from 'react'

/**
 * Auth is real: Google sign-in handled by Cloudflare Pages Functions and stored in D1.
 * Credits stay a soft, invisible gate for guests — one run costs 20, guests start with 100.
 */
const DEFAULT_CREDITS = 100
const COST_PER_RUN = 20

const CREDITS_KEY = 'jev.credits'

export interface AccountUser {
  id: string
  email: string
  name: string | null
  picture: string | null
}

function readCredits(): number {
  if (typeof window === 'undefined') return DEFAULT_CREDITS
  try {
    const raw = localStorage.getItem(CREDITS_KEY)
    if (raw === null) return DEFAULT_CREDITS
    const n = Number(raw)
    return Number.isFinite(n) ? n : DEFAULT_CREDITS
  } catch {
    return DEFAULT_CREDITS
  }
}

export function useAccount() {
  const [credits, setCredits] = useState<number>(readCredits)
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      localStorage.setItem(CREDITS_KEY, String(credits))
    } catch {
      /* ignore */
    }
  }, [credits])

  // Ask the Worker who is signed in.
  useEffect(() => {
    let alive = true
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d: { user: AccountUser | null }) => {
        if (!alive) return
        setUser(d?.user ?? null)
        setLoading(false)
      })
      .catch(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const canRun = user !== null || credits >= COST_PER_RUN

  const consumeRun = useCallback(() => {
    setCredits((c) => Math.max(0, c - COST_PER_RUN))
  }, [])

  const signInWithGoogle = useCallback(() => {
    const next = window.location.pathname + window.location.search
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    } catch {
      /* ignore */
    }
    setUser(null)
  }, [])

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      if (!response.ok) return false
      setUser(null)
      return true
    } catch {
      return false
    }
  }, [])

  return { canRun, loading, user, consumeRun, signInWithGoogle, signOut, deleteAccount }
}
