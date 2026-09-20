import { useState, type ReactNode } from 'react'
import { ArrowLeft, ShieldCheck, Trash2, X } from 'lucide-react'
import { Link } from 'react-router'
import { useAccount } from '@/lib/useAccount'
import { BrandMark } from '@/sections/Illustrations'

const EFFECTIVE_DATE = 'September 21, 2026'

function LegalShell({
  title,
  summary,
  children,
}: {
  title: string
  summary: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FEFEFE] text-zinc-900 antialiased">
      <header className="border-b border-zinc-200 bg-white/80">
        <div className="mx-auto flex h-14 w-full max-w-[760px] items-center px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="JEV AI Model home">
            <BrandMark className="h-7 w-7" />
            <span className="text-[13.5px] font-semibold">JEV AI Model</span>
          </Link>
          <Link
            to="/"
            className="ml-auto flex items-center gap-1.5 text-[12.5px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Playground
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">LEGAL</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight font-medium sm:text-[42px]">
          {title}
        </h1>
        <p className="mt-4 max-w-[640px] text-[14px] leading-7 text-zinc-600">{summary}</p>
        <p className="mt-3 text-[11.5px] text-zinc-400">Effective {EFFECTIVE_DATE}</p>

        <div className="legal-copy mt-12 space-y-10">{children}</div>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-[760px] flex-wrap gap-x-5 gap-y-2 px-4 py-7 text-[11.5px] text-zinc-500 sm:px-6">
          <span>© {new Date().getFullYear()} JEV AI Model</span>
          <Link to="/privacy" className="hover:text-zinc-900">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-zinc-900">
            Terms
          </Link>
          <a
            href="https://github.com/xiaohu0x/jevaimodel"
            className="hover:text-zinc-900"
            rel="noreferrer"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[15px] font-semibold text-zinc-900">{title}</h2>
      <div className="mt-3 space-y-3 text-[13px] leading-6 text-zinc-600">{children}</div>
    </section>
  )
}

export function PrivacyPage() {
  const account = useAccount()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deleteError, setDeleteError] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(false)
    const ok = await account.deleteAccount()
    setDeleting(false)
    if (!ok) {
      setDeleteError(true)
      return
    }
    setConfirming(false)
    setDeleted(true)
  }

  return (
    <LegalShell
      title="Privacy Policy"
      summary="JEV AI Model processes playground requests, account and usage data, and basic website analytics needed to operate and improve the service."
    >
      <Section title="Information we process">
        <p>
          You can use the playground three times without an account. State and questions are sent
          through our Cloudflare-hosted function to the TypeSafe classifier to generate an answer.
          We do not write playground inputs or generated answers to our account database.
        </p>
        <p>
          For guest access, we store a random identifier in an HTTP-only cookie and a pseudonymous
          usage count in Cloudflare D1. This lets us enforce the free-run limit without collecting an
          email address.
        </p>
        <p>
          If you sign in with Google, we receive and store your Google account identifier, email
          address, display name, and profile image. We also store a random session identifier in a
          secure, HTTP-only cookie so you can remain signed in.
        </p>
        <p>
          We use Google Analytics to understand visits and page usage. Google Analytics may process
          page URLs, browser and device information, approximate location derived from your IP
          address, and analytics identifiers stored in cookies.
        </p>
      </Section>

      <Section title="How we use information">
        <p>
          Google account information is used only to authenticate you, maintain your session, and
          provide account-related features. We do not sell personal information, serve targeted
          advertising, or use your Google data to train models.
        </p>
        <p>
          Analytics information is used to measure site traffic, find broken or confusing flows,
          and improve the playground. It is not used by us for targeted advertising.
        </p>
        <p>
          Our use and transfer of information received from Google APIs adheres to the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            rel="noreferrer"
            className="font-medium text-zinc-900 underline underline-offset-4"
          >
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements.
        </p>
      </Section>

      <Section title="Storage, providers, and retention">
        <p>
          The site and account database run on Cloudflare. Google provides sign-in, web fonts, and
          Google Analytics. Authentication sessions expire after 30 days; signing out removes the
          current server-side session. Signed-in usage counts reset daily. Account profile and
          associated usage data remain until you delete the account. Analytics data is retained
          according to the settings of our Google Analytics account.
        </p>
      </Section>

      <Section title="Your choices">
        <p>
          You may use the playground as a guest, sign out at any time, or permanently delete your
          stored profile and every active session below. Deletion cannot be undone.
        </p>
        <p>
          You can limit analytics cookies through your browser settings or a content blocker.
          Deleting your JEV AI Model account does not delete aggregate analytics records that are not
          linked to your account.
        </p>

        <div className="mt-5 border-l-2 border-zinc-200 pl-4">
          {account.loading ? (
            <p className="text-zinc-400">Checking account status…</p>
          ) : deleted ? (
            <p className="flex items-center gap-2 font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Your account data has been deleted.
            </p>
          ) : account.user ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[12px] text-zinc-500">Signed in as {account.user.email}</span>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Delete account
              </button>
            </div>
          ) : (
            <p className="text-zinc-400">You are not currently signed in.</p>
          )}
          {deleteError && (
            <p className="mt-2 text-[12px] text-red-700">
              Account deletion failed. Please reload the page and try again.
            </p>
          )}
        </div>
      </Section>

      <Section title="Security and contact">
        <p>
          We use HTTPS, restricted cookies, OAuth state validation, and PKCE to protect sign-in. To
          report a security or privacy issue, open a{' '}
          <a
            href="https://github.com/xiaohu0x/jevaimodel/issues/new"
            rel="noreferrer"
            className="font-medium text-zinc-900 underline underline-offset-4"
          >
            repository issue
          </a>
          . Do not include credentials or other sensitive information in a public issue.
        </p>
      </Section>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/35"
            aria-label="Cancel account deletion"
            onClick={() => !deleting && setConfirming(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative w-full max-w-[400px] rounded-lg border border-zinc-200 bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <h2 id="delete-account-title" className="text-[17px] font-semibold">
              Delete your account?
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-zinc-600">
              This permanently removes your Google profile information and all JEV AI Model
              sessions. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="rounded-md border border-zinc-300 px-3.5 py-2 text-[12.5px] font-medium text-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-red-700 px-3.5 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LegalShell>
  )
}

export function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      summary="These terms govern use of the JEV AI Model website and browser-based classifier playground."
    >
      <Section title="Using the service">
        <p>
          You may use JEV AI Model for lawful evaluation and experimentation. Do not attempt to
          disrupt the service, access another person’s account, automate abusive traffic, or use the
          site to violate applicable law or third-party rights.
        </p>
      </Section>

      <Section title="Inputs and outputs">
        <p>
          You retain responsibility for the information you enter and for how you use generated
          results. Do not enter confidential or regulated information you are not authorized to
          process. Outputs are automated estimates and may be incomplete or incorrect; independently
          verify them before making consequential decisions.
        </p>
      </Section>

      <Section title="Availability and changes">
        <p>
          The service is provided free of charge and may change, pause, or end without notice. We may
          restrict access when reasonably necessary to protect users, the service, or third parties.
        </p>
      </Section>

      <Section title="Disclaimer and liability">
        <p>
          The service is provided “as is” without warranties of accuracy, availability, fitness for a
          particular purpose, or non-infringement. To the extent permitted by law, JEV AI Model is not
          liable for indirect, incidental, special, consequential, or punitive damages arising from
          use of the service.
        </p>
      </Section>

      <Section title="Privacy and contact">
        <p>
          Our <Link to="/privacy" className="font-medium text-zinc-900 underline underline-offset-4">Privacy Policy</Link>{' '}
          explains how account information is handled. Questions about these terms can be opened as
          an issue in the{' '}
          <a
            href="https://github.com/xiaohu0x/jevaimodel/issues"
            rel="noreferrer"
            className="font-medium text-zinc-900 underline underline-offset-4"
          >
            public repository
          </a>
          ; do not include sensitive information in a public issue.
        </p>
      </Section>
    </LegalShell>
  )
}
