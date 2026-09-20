import { useCallback, useEffect, useMemo, useState } from 'react'

export interface AccountUser {
  id: string
  email: string
  name: string | null
  picture: string | null
}

export interface QuotaSnapshot {
  authenticated: boolean
  period: 'lifetime' | 'day'
  limit: number
  used: number
  remaining: number
  retryAfterSeconds: number
  resetAt: string | null
  canRun: boolean
}

interface AccountResponse {
  user: AccountUser | null
  quota: QuotaSnapshot
}

export function useAccount() {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [clock, setClock] = useState(Date.now())
  const [loading, setLoading] = useState(true)

  const applyQuota = useCallback((next: QuotaSnapshot | undefined) => {
    if (!next) return
    const now = Date.now()
    setQuota(next)
    setClock(now)
    setCooldownUntil(next.retryAfterSeconds > 0 ? now + next.retryAfterSeconds * 1000 : 0)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin' })
      if (!response.ok) throw new Error('account_status_unavailable')
      const data = (await response.json()) as AccountResponse
      setUser(data.user ?? null)
      applyQuota(data.quota)
    } catch (error) {
      setQuota(null)
      throw error
    } finally {
      setLoading(false)
    }
  }, [applyQuota])

  useEffect(() => {
    void refresh().catch(() => {})
  }, [refresh])

  useEffect(() => {
    if (!cooldownUntil) return
    const timer = window.setInterval(() => {
      const now = Date.now()
      setClock(now)
      if (now >= cooldownUntil) {
        setCooldownUntil(0)
        window.clearInterval(timer)
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [cooldownUntil])

  const cooldownSeconds = cooldownUntil
    ? Math.max(0, Math.ceil((cooldownUntil - clock) / 1000))
    : 0
  const canRun = Boolean(quota && quota.remaining > 0 && cooldownSeconds === 0)

  const signInWithGoogle = useCallback(() => {
    const next = window.location.pathname + window.location.search
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    } finally {
      setUser(null)
      setQuota(null)
      setLoading(true)
      await refresh().catch(() => {})
    }
  }, [refresh])

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      if (!response.ok) return false
      setUser(null)
      setQuota(null)
      setLoading(true)
      await refresh().catch(() => {})
      return true
    } catch {
      return false
    }
  }, [refresh])

  return useMemo(
    () => ({
      canRun,
      cooldownSeconds,
      loading,
      quota,
      user,
      applyQuota,
      signInWithGoogle,
      signOut,
      deleteAccount,
    }),
    [
      applyQuota,
      canRun,
      cooldownSeconds,
      deleteAccount,
      loading,
      quota,
      signInWithGoogle,
      signOut,
      user,
    ],
  )
}
