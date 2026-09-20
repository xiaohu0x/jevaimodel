const H2 = 'font-display text-[26px] font-medium tracking-[-0.02em] text-zinc-900 sm:text-[32px]'
const P = 'mt-4 text-[15px] leading-[1.75] text-zinc-600'
const H3 = 'text-[15px] font-semibold text-zinc-900'
const LI = 'text-[15px] leading-[1.7] text-zinc-600'

const USE_CASES: { title: string; body: string }[] = [
  {
    title: 'Résumé screening',
    body: 'Put a candidate profile into state and ask how well they fit the role, then ask whether they should advance. Every answer comes back with a rationale you can show to a hiring manager.',
  },
  {
    title: 'Support quality assurance',
    body: 'Load a support transcript as state and check whether the agent followed policy, plus what the customer’s final sentiment was — without reading every conversation by hand.',
  },
  {
    title: 'LLM guardrails',
    body: 'Treat a user prompt as state, ask whether it is a jailbreak attempt, and have the model choose the action a guardrail should take: allow, sanitize, block, or escalate.',
  },
  {
    title: 'Content moderation',
    body: 'Classify posts, comments, and listings against policy definitions you control, and keep a written rationale for every decision you make.',
  },
  {
    title: 'Survey and open-text coding',
    body: 'Turn free-text survey answers into consistent categories across thousands of rows, so quantitative analysis stops depending on manual coding.',
  },
  {
    title: 'Data labelling',
    body: 'Bootstrap labelled datasets by asking typed questions over your records, then review the low-confidence cases and let the rest through.',
  },
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is JEV AI Model free to use?',
    a: 'Yes. The playground on this page is free to try in your browser. Pick an example, edit the state, and run a classification without creating an account.',
  },
  {
    q: 'What is a JEV AI Model state?',
    a: 'State is a JSON object that describes the world the model should reason about — a product, a candidate, a conversation, or a prompt. JEV AI Model answers questions strictly against this state, which keeps results grounded and auditable.',
  },
  {
    q: 'What are Noul, Score, and Choice?',
    a: 'They are the three question primitives in the model. Noul evaluates how true a proposition is, Score grades a subject against a rubric, and Choice selects the best option from a set you provide.',
  },
  {
    q: 'Can JEV AI Model replace a human reviewer?',
    a: 'It is built to speed up evaluation and labelling, not to remove review. Every answer includes a confidence value and a rationale, so low-confidence cases can be routed to a person.',
  },
  {
    q: 'Do I need an API key to try JEV AI Model?',
    a: 'No. You can run the playground directly on this page. Sign in only if you want to keep going after the free trial runs out.',
  },
  {
    q: 'What can I classify with JEV AI Model?',
    a: 'Anything you can describe as state: résumés, support transcripts, user prompts, survey responses, product listings, and more. If you can write the facts as JSON and ask a typed question, the model can answer it.',
  },
]

export default function Content() {
  return (
    <div className="mx-auto w-full max-w-[820px] px-4 pb-4 sm:px-6">
      {/* What is */}
      <section id="what-is" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>What is JEV AI Model?</h2>
        <p className={P}>
          JEV AI Model is an AI classifier you can try directly in the browser. Instead of asking for
          a free-form essay, it takes a structured description of a situation — called state — and
          answers specific, typed questions about it: whether something is true, how well something
          scores against a rubric, or which option fits best.
        </p>
        <p className={P}>
          Because every answer is anchored to the state you provide, the model is easy to audit.
          You always know what the model was looking at, and you can reuse the same question across
          many different states. That makes it a practical tool for evaluation, labelling, and
          decision support rather than a chat toy.
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>How the JEV AI Model playground works</h2>
        <p className={P}>
          The playground walks through the same three steps every time, and each one maps to a
          decision you make about the classification task.
        </p>
        <ol className="mt-5 space-y-4">
          {[
            {
              t: 'Describe the state',
              b: 'Write a JSON object that captures the facts — an object, a person, a conversation, a prompt. Keep it small and honest; the model only knows what you give it.',
            },
            {
              t: 'Ask a typed question',
              b: 'Choose a primitive — Noul, Score, or Choice — and phrase the question. Wrap a key from your state in backticks to reference it, so the question works on any state with that key.',
            },
            {
              t: 'Run and read the answer',
              b: 'JEV AI Model returns a value, a confidence percentage, and a short rationale that points back to the specific state keys it used.',
            },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span>
                <span className={H3}>{s.t}</span>
                <span className={`${LI} mt-1 block`}>{s.b}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Primitives */}
      <section>
        <h2 className={`${H2} mt-12`}>The three question types in JEV AI Model</h2>

        <h3 className={`${H3} mt-6`}>Noul — how true is it?</h3>
        <p className={P}>
          Noul answers yes-or-no propositions. Ask “Is `food` a sandwich?” or “Is `prompt` a jailbreak
          attempt?” and the model returns True or False together with a confidence value and a
          rationale. Use it for binary classification, policy checks, and guardrails.
        </p>

        <h3 className={`${H3} mt-6`}>Score — how well does it grade?</h3>
        <p className={P}>
          Score grades a subject against your own rubric on a 0-to-max scale. Give it a rubric such as
          “technical depth, leadership, domain match” and it returns a score plus a
          per-dimension breakdown, so you can see where the points came from. It is a fast way to run
          LLM-as-a-judge style evaluation without writing a scoring prompt from scratch.
        </p>

        <h3 className={`${H3} mt-6`}>Choice — which option fits?</h3>
        <p className={P}>
          Choice picks the best option from a set you define and returns the full probability
          distribution across all options. Ask “What color is `object` right now?” with four options
          and you will see not just the winner, but how close the runner-up was.
        </p>
      </section>

      {/* Classification not conversation */}
      <section>
        <h2 className={`${H2} mt-12`}>Classification, not conversation</h2>
        <p className={P}>
          Most AI tools answer with prose. The model answers with values. That difference matters
          when you need to sort thousands of records, apply a policy consistently, or compare results
          over time — because a paragraph is hard to aggregate, while a label, a score, and a
          confidence are not.
        </p>
        <p className={P}>
          The playground is built around that idea. You define the shape of the answer before you ask
          the question, so the output drops straight into a spreadsheet, a database, or an evaluation
          harness. There is no format parsing step and no prompt engineering just to keep the output
          stable.
        </p>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>What you can build with JEV AI Model</h2>
        <p className={P}>
          The model fits any workflow where a person reads a record and makes a consistent
          judgement. A few examples that ship well:
        </p>
        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {USE_CASES.map((u) => (
            <div key={u.title}>
              <h3 className={H3}>{u.title}</h3>
              <p className={`${LI} mt-1.5`}>{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section>
        <h2 className={`${H2} mt-12`}>Why teams choose JEV AI Model</h2>
        <ul className="mt-5 space-y-3">
          {[
            ['Structured by default', 'Every answer is a value, a confidence, and a rationale — ready to log, compare, or store.'],
            ['Grounded in your state', 'The model reasons over the exact facts you pass in, so results stay reproducible and explainable.'],
            ['Reusable questions', 'Reference state keys with backticks and the same question works across every record you own.'],
            ['Three shapes, one call', 'Truth, scores, and choices cover most classification work without changing tools or prompts.'],
            ['Nothing to install', 'Run the playground right here in your browser, for free, with no API key.'],
          ].map(([t, b]) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              <span className={LI}>
                <strong className="font-semibold text-zinc-900">{t}.</strong> {b}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Getting started */}
      <section>
        <h2 className={`${H2} mt-12`}>Getting started with JEV AI Model</h2>
        <p className={P}>
          The fastest way to understand JEV AI Model is to load an example on this page and change it
          until it describes your own problem.
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-5">
          {[
            'Pick a walkthrough lesson or a real-life use case above to load an example.',
            'Edit the state so it describes your own situation.',
            'Adjust the question, or add another primitive.',
            'Press Run and read the structured answer.',
            'Refine the state until the answers match your judgement, then reuse the question everywhere.',
          ].map((s) => (
            <li key={s} className={LI}>
              {s}
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <h2 className={`${H2} mt-12`}>Frequently asked questions about JEV AI Model</h2>
        <div className="mt-6 space-y-6">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className={H3}>{f.q}</h3>
              <p className={`${LI} mt-1.5`}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
