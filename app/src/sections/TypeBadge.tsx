import { PRIMITIVE_META, type PrimitiveType } from '@/lib/engine'
import { TYPE_DOT } from '@/lib/type-style'
import { cn } from '@/lib/utils'

export default function TypeBadge({
  type,
  className,
}: {
  type: PrimitiveType
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white uppercase',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', TYPE_DOT[type])} />
      {PRIMITIVE_META[type].name}
    </span>
  )
}
