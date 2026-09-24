import { fireEvent, render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter, useNavigate } from 'react-router'
import Seo from '../src/sections/Seo'
import { LOCALES } from '../src/lib/locale'

function Navigate() {
  const navigate = useNavigate()
  return <><Seo /><button onClick={() => navigate('/blog')}>Blog</button><button onClick={() => navigate('/zh-cn')}>Chinese</button></>
}

it('hydration and route changes replace prerendered hreflang instead of duplicating or leaking it', () => {
  const preexisting = document.createElement('link')
  preexisting.rel = 'alternate'; preexisting.hreflang = 'en'; preexisting.href = 'https://jevaimodel.app/'
  document.head.appendChild(preexisting)
  const view = render(<MemoryRouter><Navigate /></MemoryRouter>)
  expect(document.head.querySelectorAll('link[rel="alternate"][hreflang]').length).toBe(LOCALES.length + 1)
  fireEvent.click(view.getByText('Blog'))
  expect(document.head.querySelectorAll('link[rel="alternate"][hreflang]').length).toBe(0)
  expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe('https://jevaimodel.app/blog')
  fireEvent.click(view.getByText('Chinese'))
  expect(document.documentElement.lang).toBe('zh-CN')
  expect(document.head.querySelectorAll('link[rel="alternate"][hreflang]').length).toBe(LOCALES.length + 1)
})
