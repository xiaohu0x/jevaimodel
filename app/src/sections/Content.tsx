import { LANDING_COPY } from '@/lib/landing-copy'
import { useLocale } from '@/lib/useLocale'

const H2 = 'font-display text-[26px] font-medium text-zinc-900 sm:text-[32px]'
const H3 = 'text-[15px] font-semibold text-zinc-900'
const P = 'mt-4 text-[15px] leading-[1.75] text-zinc-600'
const BODY = 'text-[15px] leading-[1.7] text-zinc-600'

export default function Content() {
  const { locale } = useLocale()
  const content = LANDING_COPY[locale]

  return (
    <div className="mx-auto w-full max-w-[820px] px-4 pb-4 sm:px-6">
      <section id="what-is" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>{content.intro.title}</h2>
        {content.intro.paragraphs.map((paragraph) => (
          <p key={paragraph} className={P}>
            {paragraph}
          </p>
        ))}
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>{content.how.title}</h2>
        <p className={P}>{content.how.intro}</p>
        <ol className="mt-5 space-y-4">
          {content.how.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">
                {index + 1}
              </span>
              <span>
                <span className={H3}>{step.title}</span>
                <span className={`${BODY} mt-1 block`}>{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className={`${H2} mt-12`}>{content.types.title}</h2>
        <div className="mt-5 divide-y divide-zinc-200 border-y border-zinc-200">
          {content.types.items.map((item) => (
            <div key={item.title} className="py-5">
              <h3 className={H3}>{item.title}</h3>
              <p className={`${BODY} mt-1.5`}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>{content.uses.title}</h2>
        <p className={P}>{content.uses.intro}</p>
        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {content.uses.items.map((item) => (
            <div key={item.title}>
              <h3 className={H3}>{item.title}</h3>
              <p className={`${BODY} mt-1.5`}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>{content.faq.title}</h2>
        <div className="mt-6 space-y-6">
          {content.faq.items.map((item) => (
            <div key={item.q}>
              <h3 className={H3}>{item.q}</h3>
              <p className={`${BODY} mt-1.5`}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
