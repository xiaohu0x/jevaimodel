import { Link } from 'react-router'
import { BrandMark } from '@/sections/Illustrations'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FEFEFE] px-5 text-zinc-900">
      <div className="w-full max-w-[560px] border-y border-zinc-200 py-12">
        <BrandMark className="h-9 w-9" />
        <p className="eyebrow mt-8">404 / NOT FOUND</p>
        <h1 className="mt-3 font-display text-[38px] leading-tight font-medium sm:text-[48px]">
          This page does not exist
        </h1>
        <p className="mt-4 max-w-[480px] text-[15px] leading-7 text-zinc-600">
          The address may have changed, or the link may be incorrect. The classifier playground and
          documentation are still available from the main navigation.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/" className="rounded-lg bg-zinc-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-zinc-700">
            Open playground
          </Link>
          <Link to="/docs" className="rounded-lg border border-zinc-300 px-4 py-2.5 text-[13px] font-semibold text-zinc-700 hover:border-zinc-500">
            Read docs
          </Link>
        </div>
      </div>
    </main>
  )
}
