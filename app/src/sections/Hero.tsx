const PILLARS = ['TYPED OUTPUT', 'CALIBRATED CONFIDENCE', 'NO SETUP']

export default function Hero() {
  return (
    <section className="border-b border-zinc-200/70">
      <div className="mx-auto w-full max-w-[820px] px-4 pt-12 pb-9 sm:px-6 sm:pt-16">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-[#e551ba] uppercase">
          AI classifier playground
        </p>
        <h1 className="mt-4 font-display text-[34px] leading-[1.04] font-medium text-zinc-900 sm:text-[52px]">
          JEV AI Model — Free Online AI Classifier Playground
        </h1>
        <p className="mt-5 max-w-[660px] text-[15px] leading-[1.7] text-zinc-600 sm:text-[16px]">
          JEV AI Model turns messy context into structured, typed answers. Describe a situation as
          JSON, ask a typed question, and get a grounded result with a confidence value. No sign-up,
          no API key, no setup.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.1em] text-zinc-400 uppercase">
          {PILLARS.map((p, i) => (
            <span key={p} className="flex items-center gap-5">
              {i > 0 && <span className="text-zinc-300">/</span>}
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
