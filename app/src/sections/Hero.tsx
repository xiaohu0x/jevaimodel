import { useLocale } from '@/lib/useLocale'

export default function Hero() {
  const { copy } = useLocale()
  const firstLine = copy.hero.lines[0]
  const secondLine = copy.seo.h1.slice(firstLine.length)

  return (
    <div className="text-center">
      <p className="font-mono text-[10.5px] font-medium tracking-[0.16em] text-[#e551ba] uppercase sm:text-[11px]">
        {copy.hero.eyebrow}
      </p>
      <h1 className="mx-auto mt-3 max-w-[900px] font-display text-[30px] leading-[1.02] font-medium tracking-[-0.03em] text-zinc-900 sm:mt-4 sm:text-[46px] sm:leading-[0.98] lg:text-[58px]">
        <span>{firstLine}</span>
        <span className="sm:block">{secondLine}</span>
      </h1>
      <p className="mx-auto mt-3.5 max-w-[580px] text-[15px] leading-[1.5] text-zinc-500 sm:mt-4 sm:text-[17px] sm:leading-[1.55]">
        {copy.hero.intro}
      </p>
    </div>
  )
}
