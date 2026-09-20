import type { PrimitiveType } from '@/lib/engine'

/** small colored dot shown inside the dark type pill */
export const TYPE_DOT: Record<PrimitiveType, string> = {
  noul: 'bg-[#09aea1]',
  score: 'bg-[#d45bb6]',
  choice: 'bg-[#03aa5c]',
}

/** bar fill used for breakdown charts */
export const TYPE_BAR: Record<PrimitiveType, string> = {
  noul: 'bg-[#09aea1]',
  score: 'bg-[#d45bb6]',
  choice: 'bg-[#03aa5c]',
}
