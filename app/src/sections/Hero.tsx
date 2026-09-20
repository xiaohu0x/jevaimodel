export default function Hero() {
  return (
    <div className="text-center">
      <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#e551ba] uppercase">
        AI classifier playground
      </p>
      <h1 className="mx-auto mt-5 max-w-[920px] font-display text-[42px] leading-[0.98] font-medium tracking-[-0.03em] text-zinc-900 sm:text-[60px] lg:text-[72px]">
        Turn a messy situation
        <br className="hidden sm:block" /> into a typed answer
      </h1>
      <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.6] text-zinc-500 sm:text-[18px]">
        Describe the context, ask a typed question, get a grounded answer with a confidence value.
        No sign-up, no API key.
      </p>
    </div>
  )
}
