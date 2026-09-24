import { useRef, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, description, children, busy = false, closeLabel = 'Close', role = 'dialog' }: {
  open: boolean
  onClose: () => void
  title: ReactNode
  description: ReactNode
  children: ReactNode
  busy?: boolean
  closeLabel?: string
  role?: 'dialog' | 'alertdialog'
}) {
  const returnFocus = useRef<HTMLElement | null>(null)
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next && !busy) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-zinc-950/35" />
        <Dialog.Content
          role={role}
          aria-busy={busy}
          onOpenAutoFocus={() => { returnFocus.current = document.activeElement as HTMLElement | null }}
          onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus() }}
          onEscapeKeyDown={(event) => { if (busy) event.preventDefault() }}
          onPointerDownOutside={(event) => { if (busy) event.preventDefault() }}
          className="fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl outline-none sm:p-7"
        >
          <Dialog.Close disabled={busy} aria-label={closeLabel} className="absolute top-4 right-4 rounded p-1 text-zinc-500 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 disabled:opacity-40">
            <X className="h-4 w-4" aria-hidden />
          </Dialog.Close>
          <Dialog.Title className="pr-6 font-display text-[22px] font-medium leading-snug text-zinc-900">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-[13px] leading-relaxed text-zinc-600">{description}</Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
