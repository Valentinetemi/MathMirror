'use client'

import { AlertCircle } from 'lucide-react'

interface MisconceptionBadgeProps {
  label: string
  description: string
}

export default function MisconceptionBadge({ label, description }: MisconceptionBadgeProps) {
  return (
    <div className="premium-card p-8 bg-gradient-to-br from-white to-background-secondary border-l-4 border-l-accent">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-accent/10 rounded-lg">
          <AlertCircle className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-accent uppercase tracking-wide">
            Common Misconception Detected
          </p>
          <h2 className="text-2xl font-bold text-foreground">{label}</h2>
          <p className="text-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
