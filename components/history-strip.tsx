'use client'

interface Misconception {
  id: string
  misconception: string
}

interface HistoryStripProps {
  history: Misconception[]
}

export default function HistoryStrip({ history }: HistoryStripProps) {
  // Count occurrences of each misconception type
  const counts = history.reduce(
    (acc, item) => {
      acc[item.misconception] = (acc[item.misconception] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const uniqueMisconceptions = Array.from(new Set(history.map(m => m.misconception)))

  return (
    <div className="mt-12 pt-8 border-t border-border space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Today's patterns
        </p>
        <p className="explanation-text text-muted-foreground">
          You've worked on{' '}
          <span className="text-primary font-semibold">{uniqueMisconceptions.length}</span> different{' '}
          {uniqueMisconceptions.length === 1 ? 'misconception' : 'misconceptions'} so far.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueMisconceptions.map((misconception) => (
          <div
            key={misconception}
            className="inline-flex items-center gap-2 px-3 py-2 bg-input border border-border rounded text-sm"
          >
            <span className="text-primary font-medium">{misconception}</span>
            {counts[misconception] > 1 && (
              <span className="text-xs text-muted-foreground font-semibold">
                ×{counts[misconception]}
              </span>
            )}
          </div>
        ))}
      </div>

      {uniqueMisconceptions.length > 1 && (
        <p className="text-xs text-muted-foreground pt-2">
          💡 Tip: Work on one type of mistake at a time to build mastery.
        </p>
      )}
    </div>
  )
}
