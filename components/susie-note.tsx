import type { ReactNode } from 'react'

interface SusieNoteProps {
  /** "note" for a quiet tip/suggestion, "celebrate" for an actual milestone. */
  tone?: 'note' | 'celebrate'
  className?: string
  children: ReactNode
}

export function SusieNote({ tone = 'note', className = '', children }: SusieNoteProps) {
  const toneClass = tone === 'celebrate'
    ? 'bg-secondary text-white'
    : 'border border-primary/15 bg-background-accent text-foreground'
  return <section className={`rounded-2xl p-6 sm:p-8 ${toneClass} ${className}`}>{children}</section>
}
