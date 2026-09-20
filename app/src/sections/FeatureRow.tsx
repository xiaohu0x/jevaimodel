import { useLocale } from '@/lib/useLocale'

export default function FeatureRow() {
  const { copy } = useLocale()

  return (
    <section className="border-y border-zinc-200">
      <div className="mx-auto grid w-full max-w-[1240px] px-4 sm:px-8 lg:grid-cols-3">
        {copy.features.map((f, i) => (
          <div
            key={f.title}
            className={
              i > 0
                ? 'border-t border-zinc-200 py-9 lg:border-t-0 lg:border-l lg:py-10 lg:pl-8'
                : 'py-9 lg:py-10 lg:pr-8'
            }
          >
            <h2 className="font-display text-[24px] font-medium tracking-[-0.025em] text-zinc-900">
              {f.title}
            </h2>
            <p className="mt-3 max-w-[340px] text-[15px] leading-[1.6] text-zinc-500">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
