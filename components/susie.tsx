const FACE = '#1e1b33'

type SusieMood = 'neutral' | 'happy' | 'celebrate' | 'thinking'

interface SusieProps {
  mood?: SusieMood
  size?: number
  className?: string
}

/** Susie, drawn as a point plotted on a graph — the mascot ties back to the
 *  subject instead of being a generic blob-with-eyes. Body fill follows
 *  `currentColor` so it composes with Tailwind text-color utilities. */
export function Susie({ mood = 'neutral', size = 48, className }: SusieProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="currentColor" />

      {mood === 'celebrate' && (
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6">
          <path d="M50 4v9M50 87v9M4 50h9M87 50h9" />
          <path d="M17 17l6.5 6.5M76.5 76.5L83 83M83 17l-6.5 6.5M23.5 76.5L17 83" />
        </g>
      )}

      <circle cx="39" cy="45" r="4.5" fill={FACE} />
      <circle cx="61" cy="45" r="4.5" fill={FACE} />

      {mood === 'thinking' && <path d="M56 34c3-2 7-2 9 0" stroke={FACE} strokeWidth="2.4" strokeLinecap="round" />}

      {mood === 'neutral' && <path d="M38 58c4 4 20 4 24 0" stroke={FACE} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {mood === 'thinking' && <path d="M40 60c3 2 17 2 20 0" stroke={FACE} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {mood === 'happy' && <path d="M35 57c5 7 25 7 30 0" stroke={FACE} strokeWidth="3.4" strokeLinecap="round" fill="none" />}
      {mood === 'celebrate' && <path d="M33 55c6 9 28 9 34 0" stroke={FACE} strokeWidth="3.6" strokeLinecap="round" fill="none" />}
    </svg>
  )
}
