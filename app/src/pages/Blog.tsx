import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import PublicShell from '@/sections/PublicShell'
import NotFoundPage from './NotFound'
import { BLOG_POSTS, blogPath } from '@/lib/blog'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-20"><h2>{title}</h2>{children}</section>
}

function Code({ children, label = 'JSON example' }: { children: string; label?: string }) {
  return <figure><figcaption className="mb-2 text-xs text-zinc-500">{label}</figcaption><pre tabIndex={0} aria-label={label}><code>{children}</code></pre></figure>
}

function ClassificationArticle() {
  return <>
    <p>Start text classification by defining what your software needs to do with the answer. If the next step is to route a support ticket, a useful result is a stable category such as <code>billing</code> or <code>technical</code>. JSON makes that result easy to pass between systems. It does not, by itself, establish that the category is correct.</p>
    <p>This guide builds a small ticket-routing contract, shows how to validate it, and connects it to a Jev Choice question. The tickets and numerical examples are illustrative. They are not a benchmark of the model.</p>
    <Section id="labels" title="Define labels around a decision">
      <p>Write down the destination for each label before writing the question. “Billing” can mean a payment error, a subscription change, or any message containing a price. Those meanings lead to different routes. A useful taxonomy spells out both what belongs in a category and how to handle overlap.</p>
      <div className="table-scroll"><table><thead><tr><th scope="col">Label</th><th scope="col">Definition for this workflow</th><th scope="col">Next step</th></tr></thead><tbody>
        <tr><td>billing</td><td>Charges, invoices, or subscription payment problems</td><td>Billing queue</td></tr>
        <tr><td>technical</td><td>A product feature or integration fails to work</td><td>Technical support queue</td></tr>
        <tr><td>sales</td><td>Questions about a plan before purchase</td><td>Sales queue</td></tr>
        <tr><td>unclear</td><td>The message lacks enough detail to choose a route</td><td>Human triage</td></tr>
      </tbody></table></div>
      <p>These definitions are a proposed policy, not a universal taxonomy. A payment integration failure could be technical even though it mentions billing. Put that boundary in the option description if it matters to your team. If tickets regularly contain two independent requests, consider two questions or a multi-label workflow instead of forcing one category.</p>
      <p><a href="https://docs.typesafe.ai/primitives">TypeSafe’s primitive guide</a> recommends Choice for an unordered set of options and suggests an “other” or “none of the above” option when your list may not cover every input. The <code>unclear</code> option here gives the application a deliberate review path.</p>
    </Section>
    <Section id="context" title="Keep evidence in context and policy in the question">
      <p>Provide the facts needed to distinguish your labels. A message about a failed connection is easier to route when the context identifies the affected integration. Avoid adding unrelated customer history simply because it is available: every field should serve the judgment you are asking for.</p>
      <Code>{`{
  "message": "The payment integration fails to connect. Can you help?",
  "product_area": "integrations"
}`}</Code>
      <p>In the playground, add a Choice question with instructions such as “Which support queue should handle the problem in message?” Then define the four named options above. For a direct TypeSafe request, the corresponding question has this shape:</p>
      <Code label="TypeSafe question object">{`{
  "route": {
    "type": "choice",
    "instructions": "Which support queue should handle the problem in message?",
    "criteria": {
      "billing": "Charges, invoices, or subscription payment problems",
      "technical": "A feature or integration fails, including payment integrations",
      "sales": "Questions about a plan before purchase",
      "unclear": "Not enough detail to choose a support queue"
    }
  }
}`}</Code>
      <p>The key <code>route</code> identifies the answer for your code. TypeSafe documents that question IDs are not sent to the model, so the instructions must contain the complete question. The <Link to="/docs">playground documentation</Link> explains the request and answer fields in more detail.</p>
    </Section>
    <Section id="validation" title="Validate the contract before taking action">
      <p>There are two different checks: whether the response has the expected structure, and whether it made a good classification. Validate the first mechanically. Evaluate the second against reviewed examples. A syntactically valid JSON response can still assign the wrong ticket to a queue.</p>
      <p>The following JSON Schema describes a small application-owned routing record. Your code constructs it after reading the model answer; it is not the full TypeSafe response schema.</p>
      <Code label="Schema for an application routing record">{`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "ticket_id": { "type": "string" },
    "category": { "enum": ["billing", "technical", "sales", "unclear"] },
    "needs_review": { "type": "boolean" }
  },
  "required": ["ticket_id", "category", "needs_review"],
  "additionalProperties": false
}`}</Code>
      <p>The JSON Schema project documents how <a href="https://json-schema.org/understanding-json-schema/reference/enum">enum limits accepted values</a> and how <a href="https://json-schema.org/understanding-json-schema/reference/object">required and additionalProperties control object fields</a>. In this simple schema, missing fields, unknown categories, and unexpected extra fields fail validation.</p>
      <p>Also verify that you received an answer for every requested question. Treat a timeout, an unreadable body, or a missing answer as a failed request. None of those outcomes should be silently converted into a legitimate business label.</p>
    </Section>
    <Section id="evaluation" title="Test boundaries and the review path">
      <p>Create a small collection of tickets that people have labeled using the written policy. Include ordinary examples, overlapping requests, short messages, and cases with insufficient information. Keep expected labels separate from the context sent to the model.</p>
      <ul><li>Check billing versus technical cases that mention the same payment terms.</li><li>Check whether vague requests reach the review queue.</li><li>Record disagreement by category instead of relying only on one overall accuracy number.</li><li>Rerun the same evaluation after changing labels, descriptions, model versions, or routing policy.</li></ul>
      <p>A confidence value can help prioritize review, but its meaning depends on the model’s definition. TypeSafe’s confidence summarizes the distribution across options; it is distinct from an individual option’s probability. Use the <Link to="/blog/classifier-confidence-calibration">confidence and calibration guide</Link> to design that part of the workflow.</p>
      <p>Once the labels and error handling are explicit, <Link to="/#playground">try the context and Choice question in the playground</Link>. Read the actual result and adjust the policy where it is ambiguous. A single plausible answer is a starting point for evaluation, not evidence that the workflow is ready to automate.</p>
    </Section>
  </>
}

function RubricArticle() {
  return <>
    <p>An LLM evaluation rubric should describe observable differences between answers. Replace “rate the quality from one to five” with levels that explain what a reviewer would see at each point. Then test whether those levels produce useful, repeatable judgments on examples from your own task.</p>
    <p>This guide uses support replies to show how to write a rubric, separate independent criteria, and review disagreements. The rubric is a worked design example. No evaluation scores or agreement rates are presented as measured model performance.</p>
    <Section id="criteria" title="Choose one criterion per question">
      <p>A reply can be friendly but incorrect, correct but incomplete, or complete but hard to follow. Combining those qualities into a single instruction makes a low score difficult to diagnose. Decide which qualities matter and ask about them independently.</p>
      <p>For this example, use policy accuracy and resolution usefulness. Policy accuracy asks whether the reply is consistent with the supplied support policy. Resolution usefulness asks whether the customer gets an actionable next step. Tone can become a third criterion if it changes the product decision.</p>
      <p><a href="https://docs.typesafe.ai/primitives">TypeSafe’s primitive documentation</a> recommends focused judgments and composing independent factors in application code. A Jev Score question uses an ordered list of level descriptions. A Noul question suits a narrow yes/no condition, such as whether the reply asks for information the customer already supplied.</p>
    </Section>
    <Section id="anchors" title="Write levels a reviewer can distinguish">
      <p>Start with the lowest and highest acceptable descriptions, then add an intermediate level only when it serves a real distinction. Labels such as “poor,” “average,” and “excellent” leave the scoring policy implicit. The levels below define what is missing or present.</p>
      <div className="table-scroll"><table><thead><tr><th scope="col">Level</th><th scope="col">Policy accuracy</th><th scope="col">Resolution usefulness</th></tr></thead><tbody>
        <tr><td>0</td><td>Contradicts a relevant rule in the supplied policy</td><td>No usable next step, or a step unrelated to the request</td></tr>
        <tr><td>1</td><td>No explicit contradiction, but a relevant condition is omitted</td><td>Relevant next step, with a necessary detail missing</td></tr>
        <tr><td>2</td><td>Matches the relevant rule and its stated conditions</td><td>Clear next step with the details needed to carry it out</td></tr>
      </tbody></table></div>
      <p>These anchors still require enough evidence. If the state contains no support policy, the evaluator cannot reliably check policy accuracy. Treat missing evidence separately: add an evidence-availability check or route that case to review instead of interpreting the middle score as “unknown.”</p>
      <p>Write one example at each level and one example near each boundary. Ask two reviewers to apply the descriptions independently where practical. Their disagreements can reveal an ambiguous policy before a model is involved. Refine the wording using those disagreements, then keep a separate evaluation set to check the revised rubric.</p>
    </Section>
    <Section id="request" title="Turn the anchors into a Score question">
      <p>Put the customer request, proposed reply, and relevant policy in the state. Use the question instructions to name the criterion and the fields to evaluate. In the playground, the levels are ordered from lowest to highest; their positions define the scale.</p>
      <Code label="A policy-accuracy Score question">{`{
  "policy_accuracy": {
    "type": "score",
    "instructions": "Evaluate reply against the relevant rules in policy for customer_request.",
    "criteria": [
      "Contradicts a relevant rule in the supplied policy",
      "No explicit contradiction, but a relevant condition is omitted",
      "Matches the relevant rule and its stated conditions"
    ]
  }
}`}</Code>
      <p>A returned score can fall between levels. TypeSafe’s <a href="https://docs.typesafe.ai/primitives">answer reference</a> describes the score as a position along the supplied levels, with a legend and a distribution across them. A value such as 1.4 should therefore be read against those anchors. It is not automatically a percentage correct or an assessment of every aspect of the reply.</p>
      <p>Keep the individual criterion results when you combine them. A weighted total is a policy you choose; document its weights and any rule that overrides the total. For example, a policy contradiction may require review even when the reply is otherwise clear. Averaging ordered categories also introduces a measurement assumption, so use a total only when it helps the downstream decision.</p>
    </Section>
    <Section id="review" title="Measure disagreements before automating">
      <p>Run the rubric on examples that were not used to write its levels. Preserve the state, expected judgment, rubric version, returned model identifier, and result. Review disagreements by cause: missing context, unclear criterion, overlapping levels, or a model error despite a clear policy.</p>
      <p>Research on LLM judges has identified position, verbosity, and self-enhancement biases. <a href="https://arxiv.org/abs/2306.05685">Zheng and colleagues’ MT-Bench and Chatbot Arena paper</a> documents these limitations. Those findings do not establish how Jev performs on your rubric, but they give you useful failure cases to test rather than assume away.</p>
      <ul><li>Compare a concise correct reply with a longer reply containing the same information.</li><li>For pairwise comparisons, swap answer order and inspect changed judgments.</li><li>Check whether irrelevant politeness masks an incorrect instruction.</li><li>Review cases near a decision threshold, not only obvious successes and failures.</li></ul>
      <p>Choose acceptance criteria before inspecting all results. Depending on your workflow, you may care most about agreement within one level, missed policy contradictions, or the proportion sent to a reviewer. Report the sample size and the examples used so a good-looking result does not lose its context.</p>
    </Section>
    <Section id="versioning" title="Version the scoring policy with the model">
      <p>Changing a level description changes the evaluation task. Record the revision, explain why it changed, and rerun the same retained cases. Keep a fresh test set for decisions you did not anticipate while editing the rubric. If you change the model too, distinguish those changes when interpreting the result.</p>
      <p>Use the <Link to="/examples">existing examples</Link> to learn the UI, then <Link to="/#playground">build a Score question</Link> for one criterion from this guide. The <Link to="/blog/classifier-confidence-calibration">confidence guide</Link> covers the separate decision of when a returned assessment should trigger human review.</p>
    </Section>
  </>
}

function ConfidenceArticle() {
  return <>
    <p>A classifier confidence score is useful only when you know what it measures. A class probability, a certainty statistic, and an observed accuracy rate answer different questions. Before turning any of them into an automatic action, define the number, check it against reviewed examples, and decide what a wrong action costs.</p>
    <p>This guide separates those concepts, explains calibration with a small numerical example, and shows how to compare review thresholds. Every numerical example below is synthetic and illustrates arithmetic, not measured Jev performance.</p>
    <Section id="meaning" title="Read the model’s definition first">
      <p>In Jev, a Noul answer provides the probability of “yes” as a number from zero to one. Choice and Score answers provide a distribution across the supplied options or levels, plus a separate confidence value. TypeSafe defines that confidence as a summary of the distribution’s shape: concentrated distributions indicate more certainty, while flatter distributions indicate less.</p>
      <p>The <a href="https://docs.typesafe.ai/confidence">official confidence documentation</a> explicitly distinguishes these fields. Do not assume that a Choice confidence of 0.8 means the selected option has probability 0.8. Inspect <code>probabilities</code> when you need the probability assigned to a particular option.</p>
      <div className="table-scroll"><table><thead><tr><th scope="col">Value</th><th scope="col">Question it addresses</th><th scope="col">What it does not establish</th></tr></thead><tbody>
        <tr><td>Noul probability</td><td>How likely is the proposition to be true?</td><td>The cost of acting on it</td></tr>
        <tr><td>Choice option probability</td><td>How much probability is assigned to this option?</td><td>Observed accuracy on your dataset</td></tr>
        <tr><td>TypeSafe confidence</td><td>How concentrated is the answer distribution?</td><td>An interchangeable value for one option’s probability</td></tr>
        <tr><td>Measured accuracy</td><td>How often did predictions agree with reference labels?</td><td>How well every confidence range is calibrated</td></tr>
      </tbody></table></div>
      <p>A Noul value near 0.5 means similar probability for yes and no. It does not mean a medium quantity or skill level. Use an ordered Score question when the task is to place something on a scale.</p>
    </Section>
    <Section id="calibration" title="Calibration compares groups of predictions with outcomes">
      <p>The <a href="https://scikit-learn.org/stable/modules/calibration.html">scikit-learn calibration guide</a> describes a well-calibrated binary classifier this way: among cases assigned positive-class probabilities near 0.8, roughly 80% should actually belong to the positive class. This is a statement about a collection of comparable cases, not a guarantee for one item.</p>
      <p>Imagine 20 reviewed messages assigned urgency probabilities near 0.8. If 16 are urgent under your labeling policy, the observed positive fraction is 16 / 20 = 80%. If only 10 are urgent, the same group has an observed fraction of 50%, suggesting overconfidence for that group. Twenty cases are a small teaching example, so neither result is a precise estimate of future performance.</p>
      <p>For a real check, retain predicted probabilities and independent reference labels. Group predictions into probability ranges, compare each range’s average prediction with its observed outcome frequency, and report how many examples each range contains. Inspect important subgroups, such as language or ticket category, when your data supports doing so.</p>
      <p>Do not label the TypeSafe confidence statistic as a calibrated correctness probability merely because it lies between zero and one. You can still measure error rates at different confidence ranges, but the mapping is something to evaluate for your task.</p>
    </Section>
    <Section id="threshold" title="Choose thresholds around an action">
      <p>Predicting a category and deciding whether to act are separate steps. The <a href="https://scikit-learn.org/stable/modules/classification_threshold.html">scikit-learn threshold guide</a> makes this distinction explicit and recommends selecting thresholds for the application’s objective. A threshold suitable for a reversible queue assignment may be unsuitable for an action that changes customer data.</p>
      <p>Define the review policy before optimizing a number. For a support workflow, you might send low-certainty or unclear tickets to a reviewer and automatically route only the remaining cases. There is no universal confidence threshold that makes this safe or accurate across datasets.</p>
      <p>Compare the error rate of automatic decisions with coverage: the fraction of all cases you handle automatically. Suppose a synthetic evaluation set contains 50 tickets. A candidate threshold routes 20 automatically, and 17 of those routes match the reference labels. Coverage is 20 / 50 = 40%; accuracy among automatic routes is 17 / 20 = 85%. Both numbers matter. A higher threshold might improve that subset’s accuracy while sending more work to people.</p>
      <Code label="Illustrative review policy, not a recommended numerical threshold">{`function routeTicket(answer, reviewedPolicy) {
  if (answer.choice === "unclear") return "human_review";
  if (answer.confidence < reviewedPolicy.minConfidence) {
    return "human_review";
  }
  return answer.choice;
}`}</Code>
      <p>The policy’s <code>minConfidence</code> must come from your evaluation and the cost of mistakes. Keep timeout handling and malformed responses outside this logic; a missing prediction should not fall through into an automatic route.</p>
    </Section>
    <Section id="monitor" title="Retest when inputs, labels, or models change">
      <p>Use a validation set to choose a threshold and a separate test set to estimate the behavior of the chosen policy. Reusing the same examples for training, repeated rubric edits, threshold selection, and final reporting makes it harder to tell whether the policy generalizes.</p>
      <p>After a model or policy change, rerun retained cases and sample new traffic for review. Changes in the number of options, level definitions, or input mix can change how a confidence range relates to errors. Preserve the returned model identifier and question version with evaluation results.</p>
      <p>For an end-to-end design, combine this process with the <Link to="/blog/text-classification-json">JSON classification contract</Link> and the <Link to="/blog/llm-evaluation-rubric">rubric guide</Link>. Then <Link to="/#playground">inspect a real Jev result in the playground</Link>, keeping the model’s numbers separate from the application policy you build around them.</p>
    </Section>
  </>
}

const ARTICLES: Record<string, () => ReactNode> = {
  'text-classification-json': ClassificationArticle,
  'llm-evaluation-rubric': RubricArticle,
  'classifier-confidence-calibration': ConfidenceArticle,
}

export function BlogIndex() {
  return <PublicShell eyebrow="GUIDES & ANALYSIS" title="Build classification workflows you can evaluate" summary="Practical guides to labels, scoring rubrics, and confidence. Connect structured model outputs to explicit application decisions.">
    <div className="grid gap-5">
      {BLOG_POSTS.map((post) => <article key={post.slug} className="rounded-2xl border border-zinc-200 p-6">
        <p className="eyebrow">{post.category}</p>
        <h2 className="mt-3 font-display text-2xl leading-snug"><Link to={blogPath(post)} className="hover:underline">{post.title}</Link></h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{post.description}</p>
        <p className="mt-4 text-xs text-zinc-500"><time dateTime={post.date}>September 24, 2026</time> · JEV AI Model</p>
      </article>)}
    </div>
    <section id="editorial" className="mt-12 border-t border-zinc-200 pt-8 text-sm leading-7 text-zinc-600">
      <h2 className="text-lg font-semibold text-zinc-900">How these guides are prepared</h2>
      <p className="mt-3">These articles combine primary documentation, cited research, and worked examples. They were drafted with AI assistance and checked against the linked sources. Language review was performed by an AI model; no human expert review or independent model benchmark is claimed. Numerical teaching examples are labeled as illustrative.</p>
      <p className="mt-3">For the product reference, visit <Link to="/docs" className="underline">Docs</Link>. For complete starting inputs, browse <Link to="/examples" className="underline">Examples</Link>.</p>
    </section>
  </PublicShell>
}

export function BlogArticle() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find((candidate) => candidate.slug === slug)
  if (!post) return <NotFoundPage />
  const Article = ARTICLES[post.slug]
  return <PublicShell eyebrow={post.category.toUpperCase()} title={post.title} summary={post.description}>
    <article className="article-copy max-w-[740px]">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link to="/blog">Blog</Link><span aria-hidden> / </span><span>{post.category}</span></nav>
      <p className="mb-10 text-sm text-zinc-500">By <Link to="/blog#editorial">JEV AI Model</Link> · <time dateTime={post.date}>September 24, 2026</time></p>
      <Article />
      <aside className="mt-12 rounded-xl border border-zinc-200 p-5">
        <h2>Keep learning</h2><ul>{BLOG_POSTS.filter((other) => other.slug !== post.slug).map((other) => <li key={other.slug}><Link to={blogPath(other)}>{other.title}</Link></li>)}</ul>
      </aside>
    </article>
  </PublicShell>
}
