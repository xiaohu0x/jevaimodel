import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { accountAction, AuthRequestError } from './auth-client'

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
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const refreshController = useRef<AbortController | null>(null)
  const actionPending = useRef(false)

  const applyQuota = useCallback((next: QuotaSnapshot | undefined) => {
    if (!next) return
    const now = Date.now()
    setQuota(next)
    setClock(now)
    setCooldownUntil(next.retryAfterSeconds > 0 ? now + next.retryAfterSeconds * 1000 : 0)
  }, [])

  const refresh = useCallback(async () => {
    if (actionPending.current) return
    refreshController.current?.abort()
    const controller = new AbortController()
    refreshController.current = controller
    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]) })
      if (!response.ok) throw new Error('account_status_unavailable')
      const data = (await response.json()) as AccountResponse
      if (controller.signal.aborted) return
      setUser(data.user ?? null)
      applyQuota(data.quota)
    } catch (error) {
      if (controller.signal.aborted) return
      setQuota(null)
      throw error
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [applyQuota])

  useEffect(() => {
    void refresh().catch(() => {})
    const onFocus = () => { void refresh().catch(() => {}) }
    window.addEventListener('focus', onFocus)
    return () => {
      refreshController.current?.abort()
      window.removeEventListener('focus', onFocus)
    }
  }, [refresh])

  useEffect(() => {
    if (!quota?.resetAt) return
    const delay = new Date(quota.resetAt).getTime() - Date.now()
    if (!Number.isFinite(delay)) return
    const timer = window.setTimeout(() => { void refresh().catch(() => {}) }, Math.max(1000, delay))
    return () => window.clearTimeout(timer)
  }, [quota?.resetAt, refresh])

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
    const next = window.location.pathname + window.location.search + window.location.hash
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`
  }, [])

  const act = useCallback(async (path: 'logout' | 'account', method: 'POST' | 'DELETE') => {
    if (actionPending.current) return false
    actionPending.current = true
    refreshController.current?.abort()
    setBusy(true)
    setActionError(null)
    try {
      await accountAction(path, method)
      setUser(null)
      setQuota(null)
      setLoading(true)
      actionPending.current = false
      await refresh().catch(() => {})
      return true
    } catch (error) {
      if (error instanceof AuthRequestError && error.status === 401) setUser(null)
      setActionError(error instanceof Error ? error.message : 'The account request failed.')
      return false
    } finally {
      actionPending.current = false
      setBusy(false)
    }
  }, [refresh])

  const signOut = useCallback(() => act('logout', 'POST'), [act])
  const deleteAccount = useCallback(() => act('account', 'DELETE'), [act])

  return useMemo(
    () => ({
      actionError,
      busy,
      refresh,
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
      actionError,
      busy,
      refresh,
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
