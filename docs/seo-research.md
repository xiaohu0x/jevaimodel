# Blog research and review, September 24, 2026

## Brief

Create three original English guides for developers designing classification workflows. Target locale: `en`, with US English spelling and an international technical audience. No regional pricing, legal claims, keyword volumes, ranking promises, or invented author credentials. Conversion path: article → related guide → existing playground. Existing `/docs` is the primitive reference; `/examples` contains sample inputs. New articles address design and evaluation decisions instead of repeating those pages.

## Search-intent brief

| Candidate query | Reader job and format | Added value | Excluded intent |
| --- | --- | --- | --- |
| text classification JSON | Tutorial: define labels and validate the output contract | A ticket taxonomy, failure examples, a JSON Schema, and a mapping to the actual Jev Choice contract | Model rankings, training a classifier, generic JSON syntax |
| LLM evaluation rubric | Guide: write observable scoring levels and test evaluator agreement | Anchored support-reply rubric, separate criteria, review protocol, and a versioning checklist | Product leaderboards, autonomous hiring decisions |
| classifier confidence calibration | Explanation: distinguish probabilities, certainty, and action thresholds | Numerical calibration example and a review-coverage calculation, plus TypeSafe's actual confidence semantics | Guaranteed accuracy, universal threshold recommendations |

Search attempts on September 24, 2026 used English queries through Google, Bing, DuckDuckGo, Yahoo, and Brave. Google/DuckDuckGo returned bot challenges, Yahoo failed, and Brave returned HTTP 429. Bing results were dominated by generic/irrelevant terms even with English/US parameters and quotation marks, so they do not establish the intended long-tail search behavior. These are candidate queries based on primary-source terminology, not verified search demand. No first-party Search Console data was available. Search-intent status remains pending until relevant live results can be inspected.

## Claim ledger (built before drafting)

All sources below were opened and read on September 24, 2026. Source update dates are not asserted when unavailable. Examples are original, synthetic teaching examples, not measured production outcomes.

| ID | Claim | Type | Source / owner | Evidence and limits | Status |
| --- | --- | --- | --- | --- | --- |
| J1 | Choice uses named criteria, Score uses ordered levels, Noul returns a probability without a separate confidence field | Fact | https://docs.typesafe.ai/primitives — TypeSafe | Primitive comparison and “What comes back”; field names cross-checked with this repo's real proxy and request-shape tests | Verified |
| J2 | Choice/Score confidence summarizes the shape of the returned distribution and is distinct from a selected-option probability | Fact | https://docs.typesafe.ai/confidence — TypeSafe | “Confidence is derived from the probabilities”; no formula is assumed | Verified |
| J3 | Separate judgments may share state; independent scoring factors can be combined by application logic | Fact/recommendation | https://docs.typesafe.ai/primitives — TypeSafe | “Ask for one snap judgment per question”; weighting policy is application-defined, not a universal measurement scale | Verified |
| S1 | JSON Schema enum constrains values; required and additionalProperties control object fields | Fact | https://json-schema.org/understanding-json-schema/reference/enum and https://json-schema.org/understanding-json-schema/reference/object — JSON Schema project | An enum is a unique fixed list; properties are optional by default; false rejects additional properties in this simple non-composed schema | Verified |
| C1 | Well-calibrated 0.8 positive-class estimates correspond to roughly 80% positives across comparable cases | Fact | https://scikit-learn.org/stable/modules/calibration.html — scikit-learn developers | Opening definition; a group-level property, not a guarantee for an individual prediction | Verified |
| C2 | Decision thresholds should follow the application objective and be tuned with independent evaluation data | Fact/recommendation | https://scikit-learn.org/stable/modules/classification_threshold.html — scikit-learn developers | Separates statistical prediction and action decisions; warns against tuning on training data | Verified |
| E1 | LLM judge studies identify position, verbosity, and self-enhancement biases | Research finding | https://arxiv.org/abs/2306.05685 — Zheng et al., 2023 | Abstract explicitly lists these limitations; no quantitative benchmark result is generalized to Jev | Verified |
| X1 | 16/20 = 80%; 17/20 = 85%; 20/50 = 40% coverage | Calculation | Article's explicitly synthetic examples | Arithmetic only; no actual model-performance claim | Verified |
| T1 | Article schema should accurately describe visible author, dates, and content | Fact | https://developers.google.com/search/docs/appearance/structured-data/article — Google Search Central | Recommended properties, visible content, and accessible pages; no rich-result guarantee | Verified |

## Editorial and language rules

Use “context” for input, “label” for a category, “level” for a position on a scoring scale, and “confidence” only with its stated definition. Keep literal API names unchanged. Explain thresholds as policy choices. Cite primary sources near claims. Use an organizational byline, disclose AI assistance, and do not invent human review or firsthand benchmark experience. Language review is model-only. These are original English articles; semantic fidelity to a translated source is not applicable.

## Journey and publication gates

All new articles and their shared shell are English. Links to `/docs`, `/examples`, `/blog`, the English playground `/`, and official citations resolve to English content. Links from localized home pages explicitly label the blog as English. No blog translations or hreflang alternates are manufactured.

Track structural, factual, language, search-intent, journey, and rendered SEO checks separately in the final review below. On September 24, 2026 the user explicitly approved indexing these three articles despite the search-research limitation, with subsequent Search Console validation. Articles are included in the sitemap under that instruction. Search-intent status remains research-limited; no traffic or ranking claim is made.


## Review passes

- Evidence: checked the nearby claims against J1–J3, S1, C1–C2, E1, X1, and T1. Removed any assumption about the formula for TypeSafe confidence; the current primary documentation states only that it is derived from the distribution.
- Semantics: original English content, not a translation. Checked the separation of probability, confidence, calibration, and action policy, and retained the limits of the cited judge study.
- Language: separate model-only review of all three guides; consistent US spelling, technical literals, concrete examples, and no fabricated author or benchmark.
- Search: queries remain hypotheses because the available search surfaces failed or returned irrelevant results. Google/DuckDuckGo/Yandex/Qwant presented anti-bot checks; Brave rate-limited; Yahoo failed; Mojeek timed out. User approved indexability as an exception and requested later Search Console verification.
- Journey: all article links lead to English reference pages, sibling guides, or the English playground. Localized footer links label the destination as English. No hreflang is added to English-only articles.
- Render: static HTML checks cover title, canonical, robots, JSON-LD, heading count, sitemap, and links. Desktop and 320-pixel browser review identified a clipped navigation row; it was changed to wrap at narrow widths. Final verification is recorded after the last build.


## Final status (English)

| Gate | Result |
| --- | --- |
| Structural integrity | Passed: three complete article routes, valid JSON examples, valid internal destinations and anchors |
| Factual verification | Passed against the primary-source ledger; synthetic examples are labeled |
| Semantic fidelity | Not applicable: original English writing |
| Language review | Separate model-only review completed; no human native review claimed |
| Search-intent verification | Incomplete because search results could not be reliably inspected; user explicitly accepted this limitation |
| Linked journey | Passed: English destinations, with English destination labels from localized navigation |
| Technical SEO | Passed: rendered HTML, per-route canonical, robots, JSON-LD, sitemap inclusion, 200/301/404 responses |
| Index recommendation | Index under the user's explicit September 24 approval; validate actual queries in Search Console after deployment |
| External publication | This record covers repository review; release status is tracked in Git and Cloudflare deployment records |
