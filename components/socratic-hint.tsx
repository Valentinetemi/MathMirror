'use client'

import { ChevronDown, Lightbulb } from 'lucide-react'

interface SocraticHintProps {
  hint: string
  explanation: string
  showExplanation: boolean
  onShowExplanation: () => void
}

export default function SocraticHint({
  hint,
  explanation,
  showExplanation,
  onShowExplanation,
}: SocraticHintProps) {
  return (
    <div className="premium-card p-6 bg-gradient-to-br from-secondary/5 to-white border-l-4 border-l-secondary">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wide mb-1">Hint</p>
            <p className="explanation-text font-medium text-foreground text-lg">{hint}</p>
          </div>
        </div>

        {!showExplanation && (
          <button
            onClick={onShowExplanation}
            className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-smooth font-semibold text-sm mt-2"
          >
            <ChevronDown size={18} />
            Show Full Explanation
          </button>
        )}

        {showExplanation && (
          <div className="animate-slideIn mt-4 pt-4 border-t border-secondary/20 space-y-2">
            <p className="explanation-text text-foreground leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
