export class AuthRequestError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function accountAction(path: 'logout' | 'account', method: 'POST' | 'DELETE') {
  let response: Response
  try {
    response = await fetch(`/api/auth/${path}`, {
      method, credentials: 'same-origin', signal: AbortSignal.timeout(10_000),
    })
  } catch {
    throw new AuthRequestError('Could not reach the account service. Please try again.', 0)
  }
  if (response.status === 401) throw new AuthRequestError('Your session expired. Sign in again to delete your account.', 401)
  if (!response.ok) throw new AuthRequestError('The account request failed. Please try again.', response.status)
  const data = await response.json().catch(() => null) as { ok?: boolean } | null
  if (data?.ok !== true) throw new AuthRequestError('The account service returned an unexpected response.', response.status)
}
