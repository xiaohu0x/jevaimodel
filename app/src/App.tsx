import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import { PrivacyPage, TermsPage } from './pages/Legal'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
