export const BLOG_POSTS = [
  {
    slug: 'text-classification-json',
    title: 'Text classification with JSON: design labels and validate outputs',
    description: 'Build a support ticket classification contract with clear labels, JSON validation, and a review path. Includes a worked example for Jev Choice questions.',
    category: 'Classification design',
    date: '2026-09-24',
    indexable: true,
  },
  {
    slug: 'llm-evaluation-rubric',
    title: 'How to write an LLM evaluation rubric you can test',
    description: 'Turn vague quality goals into observable scoring levels. Design a support reply rubric, separate criteria, and check agreement before automating evaluation.',
    category: 'Evaluation',
    date: '2026-09-24',
    indexable: true,
  },
  {
    slug: 'classifier-confidence-calibration',
    title: 'Classifier confidence scores: calibration and review thresholds',
    description: 'Understand the difference between class probability and confidence, check calibration, and choose review thresholds using explicit coverage and error tradeoffs.',
    category: 'Interpreting results',
    date: '2026-09-24',
    indexable: true,
  },
] as const

export type BlogPost = (typeof BLOG_POSTS)[number]
export function blogPath(post: BlogPost) { return `/blog/${post.slug}` }
