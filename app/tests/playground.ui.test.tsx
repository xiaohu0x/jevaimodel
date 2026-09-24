import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import Home from '../src/pages/Home'
import { DRAFT_KEY } from '../src/lib/draft'
import { useAccount } from '../src/lib/useAccount'

const question = { id: 'q1', type: 'noul', instructions: 'The customer requests a refund' }
const guestQuota = { authenticated: false, period: 'lifetime', limit: 3, used: 0, remaining: 3, retryAfterSeconds: 0, resetAt: null, canRun: true }
const user = { id: 'u1', email: 'review@example.com', name: 'Review', picture: null }
function seed() {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, state: '{"message":"Please refund the duplicate charge"}', questions: [question], runs: [] }))
}
function renderHome() { return render(<MemoryRouter><Home /></MemoryRouter>) }
function mockAccount() {
  const fetcher = vi.fn(async () => Response.json({ user: null, quota: guestQuota }))
  vi.stubGlobal('fetch', fetcher)
  return fetcher
}

describe('playground interactions', () => {
  it('restores a draft after navigation and clears the persisted work', async () => {
    mockAccount(); seed()
    const first = renderHome()
    await screen.findByDisplayValue(question.instructions)
    fireEvent.change(screen.getByDisplayValue(question.instructions), { target: { value: 'Updated question' } })
    first.unmount()
    renderHome()
    await screen.findByDisplayValue('Updated question')
    fireEvent.click(screen.getByRole('button', { name: /^Clear$/i }))
    expect(JSON.parse(sessionStorage.getItem(DRAFT_KEY)!).questions).toEqual([])
    expect(screen.queryByDisplayValue('Updated question')).toBeNull()
  })

  it('Clear aborts a pending request and a late reply cannot restore old results', async () => {
    seed()
    let finish!: (response: Response) => void
    let signal: AbortSignal | undefined
    vi.stubGlobal('fetch', vi.fn((path: string, options?: RequestInit) => {
      if (path === '/api/classify') {
        signal = options?.signal as AbortSignal
        return new Promise<Response>((resolve) => { finish = resolve })
      }
      return Promise.resolve(Response.json({ user: null, quota: guestQuota }))
    }))
    renderHome()
    const run = await screen.findByRole('button', { name: /Run.*⌘/ })
    await waitFor(() => expect(run.hasAttribute('disabled')).toBe(false))
    fireEvent.click(run)
    await waitFor(() => expect(signal).toBeDefined())
    fireEvent.click(screen.getByRole('button', { name: /^Clear$/i }))
    expect(signal?.aborted).toBe(true)
    await act(async () => finish(Response.json({ model: 'jev-test', answers: { q1: { type: 'noul', noul: 0.9 } } })))
    expect(JSON.parse(sessionStorage.getItem(DRAFT_KEY)!).runs).toEqual([])
    expect(screen.queryByText('jev-test')).toBeNull()
  })

  it('reports clipboard rejection without displaying Copied', async () => {
    mockAccount(); seed()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    renderHome()
    fireEvent.click(screen.getByRole('button', { name: 'Share' }))
    await screen.findByText(/Could not copy/)
    expect(screen.queryByRole('button', { name: 'Copied' })).toBeNull()
  })

  it('storage failure offers an explicit way to continue signing in without losing work silently', async () => {
    mockAccount(); seed()
    renderHome()
    await screen.findByDisplayValue(question.instructions)
    const failedWrite = vi.fn(() => { throw new Error('storage disabled') })
    vi.stubGlobal('sessionStorage', { getItem: sessionStorage.getItem.bind(sessionStorage), setItem: failedWrite })
    const signIn = screen.getByRole('button', { name: /^Sign in$/ })
    await waitFor(() => expect(signIn.hasAttribute('disabled')).toBe(false))
    fireEvent.click(signIn)
    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))
    expect(failedWrite).toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue without saving' })).toBeTruthy()
  })

  it('the login dialog traps focus, closes with Escape, and restores focus', async () => {
    mockAccount()
    const keyboard = userEvent.setup()
    renderHome()
    const trigger = screen.getByRole('button', { name: /^Sign in$/ })
    await waitFor(() => expect(trigger.hasAttribute('disabled')).toBe(false))
    await keyboard.click(trigger)
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 7; i++) { await keyboard.tab(); expect(dialog.contains(document.activeElement)).toBe(true) }
    await keyboard.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
})

function AccountHarness() {
  const account = useAccount()
  return <><span>{account.user?.email ?? 'guest'}</span><span>{account.actionError}</span><button onClick={account.signOut}>Sign out</button></>
}

it('a failed logout preserves the authenticated UI and reports the error', async () => {
  vi.stubGlobal('fetch', vi.fn((path: string) => Promise.resolve(path.endsWith('/logout')
    ? Response.json({ error: 'database unavailable' }, { status: 503 })
    : Response.json({ user, quota: { ...guestQuota, authenticated: true, period: 'day' } }))))
  render(<AccountHarness />)
  await screen.findByText(user.email)
  fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
  await screen.findByText(/account request failed/)
  expect(screen.getByText(user.email)).toBeTruthy()
})
