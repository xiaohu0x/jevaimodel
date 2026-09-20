import { BookOpen, ChartBar, FlaskConical, House, LogOut } from 'lucide-react'
import type { AccountUser } from '@/lib/useAccount'
import { cn } from '@/lib/utils'

export type NavKey = 'home' | 'playground' | 'usage' | 'docs'

const NAV: { key: NavKey; label: string; icon: typeof House }[] = [
  { key: 'home', label: 'Home', icon: House },
  { key: 'playground', label: 'Playground', icon: FlaskConical },
  { key: 'usage', label: 'Usage', icon: ChartBar },
  { key: 'docs', label: 'Documentation', icon: BookOpen },
]

interface SidebarProps {
  active: NavKey
  onNavigate: (key: NavKey) => void
  user: AccountUser | null
  onSignOut: () => void
}

export default function Sidebar({ active, onNavigate, user, onSignOut }: SidebarProps) {
  return (
    <aside className="flex h-full w-[216px] shrink-0 flex-col border-r border-zinc-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2" width="13" height="2.6" rx="1.3" fill="#fafafa" />
            <rect x="1.5" y="6.7" width="9" height="2.6" rx="1.3" fill="#fafafa" opacity="0.65" />
            <rect x="1.5" y="11.4" width="5.5" height="2.6" rx="1.3" fill="#fafafa" opacity="0.35" />
          </svg>
        </div>
        <span className="text-[12px] font-bold tracking-[0.14em] text-zinc-900">
          CLASSIFY
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors',
                isActive
                  ? 'bg-zinc-100 font-semibold text-zinc-900'
                  : 'font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800',
              )}
            >
              <Icon
                className={cn('h-4 w-4', isActive ? 'text-zinc-900' : 'text-zinc-400')}
                strokeWidth={1.8}
              />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-zinc-100 p-3">
        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[12px] font-semibold text-zinc-800">{user.name}</div>
              <div className="truncate text-[10px] text-zinc-400">{user.email}</div>
            </div>
            <button
              onClick={onSignOut}
              title="Sign out"
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        ) : (
          <div className="px-2 py-1.5 text-[11px] text-zinc-300">Guest session</div>
        )}
      </div>
    </aside>
  )
}
