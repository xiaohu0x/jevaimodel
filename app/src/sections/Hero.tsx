export default function Hero() {
  return (
    <div className="text-center">
      <p className="font-mono text-[10.5px] font-medium tracking-[0.16em] text-[#e551ba] uppercase sm:text-[11px]">
        AI classifier playground
      </p>
      <h1 className="mx-auto mt-3 max-w-[900px] font-display text-[30px] leading-[1.02] font-medium tracking-[-0.03em] text-zinc-900 sm:mt-4 sm:text-[46px] sm:leading-[0.98] lg:text-[58px]">
        Turn a messy situation
        <br className="hidden sm:block" /> into a typed answer
      </h1>
      <p className="mx-auto mt-3.5 max-w-[580px] text-[15px] leading-[1.5] text-zinc-500 sm:mt-4 sm:text-[17px] sm:leading-[1.55]">
        Describe the context, ask a typed question, get a grounded answer with a confidence value.
      </p>
    </div>
  )
}
