import Link from 'next/link'
import { CheckCircle2, LockKeyhole } from 'lucide-react'
import { Susie } from './susie'

interface Topic {
  title: string
  description: string
  complete: boolean
}

/** The mastery roadmap as a winding, dashed path — styled like a number line
 *  rather than borrowing a gamified trail literally. */
export function RoadmapPath({ topics }: { topics: Topic[] }) {
  return (
    <div className="relative mt-8">
      <div
        className="absolute left-7 top-9 bottom-9 w-0.5"
        style={{ backgroundImage: 'linear-gradient(var(--border) 60%, transparent 0%)', backgroundSize: '2px 10px', backgroundRepeat: 'repeat-y' }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        {topics.map((topic, index) => {
          const unlocked = index === 0 || topics[index - 1].complete
          const state: 'mastered' | 'current' | 'locked' = topic.complete ? 'mastered' : unlocked ? 'current' : 'locked'

          const row = (
            <div className="flex items-center gap-4 rounded-xl px-2 py-3">
              <div
                className={
                  'relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ' +
                  (state === 'mastered'
                    ? 'border-accent-success bg-accent-success'
                    : state === 'current'
                    ? 'border-primary bg-primary ring-8 ring-primary/15'
                    : 'border-dashed border-border text-muted-foreground')
                }
              >
                {state === 'mastered' && <CheckCircle2 className="h-6 w-6 text-white" />}
                {state === 'current' && <span className="h-3 w-3 rounded-full bg-white" />}
                {state === 'locked' && <LockKeyhole className="h-5 w-5" />}
                {state === 'current' && <Susie mood="happy" size={38} className="absolute -right-3 -top-3 text-accent-warning drop-shadow" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className={'truncate text-lg font-bold ' + (state === 'locked' ? 'text-muted-foreground' : topic.complete ? 'text-muted-foreground line-through' : 'text-foreground')}>
                  {topic.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{topic.description}</p>
              </div>

              {state !== 'locked' && (
                <span className={'shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ' + (state === 'mastered' ? 'bg-accent-success' : 'bg-primary')}>
                  {state === 'mastered' ? 'Mastered' : 'In progress'}
                </span>
              )}
            </div>
          )

          return unlocked ? (
            <Link key={topic.title} href={`/lesson/${encodeURIComponent(topic.title)}`} className="transition-colors hover:bg-background-accent">
              {row}
            </Link>
          ) : (
            <div key={topic.title} className="opacity-70">{row}</div>
          )
        })}
      </div>
    </div>
  )
}
