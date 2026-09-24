import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import { PrivacyPage, TermsPage } from './pages/Legal'
import { DocsPage, ExamplesPage, UseCasesPage } from './pages/Guides'
import NotFoundPage from './pages/NotFound'
import Seo from './sections/Seo'
import { LOCALIZED_HOME_PATHS } from './lib/locale'

const BlogIndex = lazy(() => import('./pages/Blog').then((module) => ({ default: module.BlogIndex })))
const BlogArticle = lazy(() => import('./pages/Blog').then((module) => ({ default: module.BlogArticle })))

export default function App() {
  return (
    <>
      <Seo />
      <Suspense fallback={<p role="status" className="p-8 text-sm text-zinc-500">Loading…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        {LOCALIZED_HOME_PATHS.map((path) => (
          <Route key={path} path={path} element={<Home />} />
        ))}
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/use-cases" element={<UseCasesPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </>
  )
}
