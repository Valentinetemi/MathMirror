'use client'

import Link from 'next/link'
import { Award, BarChart3, CheckCircle2, CircleDashed, RefreshCcw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { emptyProgress, getProgress, resetProgress, type Progress } from '@/lib/progress'
import { SusieNote } from '@/components/susie-note'

export default function DashboardPage() {
  const [progress, setProgress] = useState<Progress>(emptyProgress)

  useEffect(() => {
    const refresh = () => setProgress(getProgress())
    refresh()
    window.addEventListener('mathmirror-progress-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('mathmirror-progress-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const accuracy = progress.totalQuizAnswers ? Math.round((progress.correctAnswers / progress.totalQuizAnswers) * 100) : 0
  const level = Math.floor(progress.xp / 100) + 1
  const currentLevelXp = progress.xp % 100
  const hasProgress = progress.xp > 0

  return (
    <div className="min-h-screen bg-background-secondary px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Your learning space</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">Your progress</h1>
            <p className="mt-2 text-muted-foreground">Everything here is saved only in this browser.</p>
          </div>
          {hasProgress && <button onClick={() => { resetProgress(); setProgress(emptyProgress) }} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-muted-foreground hover:text-foreground sm:self-auto"><RefreshCcw className="h-4 w-4" /> Reset this browser&apos;s progress</button>}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <section className="premium-card p-6">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold text-muted-foreground">Current level</p><Award className="h-5 w-5 text-amber-500" /></div>
            <p className="mt-4 text-5xl font-bold text-foreground">{level}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-background-secondary"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${currentLevelXp}%` }} /></div>
            <p className="mt-2 text-xs text-muted-foreground">{currentLevelXp}/100 points to level {level + 1}</p>
          </section>
          <section className="premium-card p-6">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold text-muted-foreground">Steps checked</p><CheckCircle2 className="h-5 w-5 text-primary" /></div>
            <p className="mt-4 text-5xl font-bold text-foreground">{progress.problemsChecked}</p>
            <p className="mt-4 text-sm text-muted-foreground">Every question you check builds confidence.</p>
          </section>
          <section className="premium-card p-6">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold text-muted-foreground">Quiz accuracy</p><Target className="h-5 w-5 text-secondary" /></div>
            <p className="mt-4 text-5xl font-bold text-foreground">{accuracy}<span className="text-2xl">%</span></p>
            <p className="mt-4 text-sm text-muted-foreground">{progress.correctAnswers} correct from {progress.totalQuizAnswers} answers.</p>
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <section className="premium-card p-7">
            <div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2 text-primary"><BarChart3 className="h-5 w-5" /></div><div><h2 className="text-xl font-bold text-foreground">Recent learning</h2><p className="text-sm text-muted-foreground">A small record of your work in this browser.</p></div></div>
            {progress.activities.length ? <div className="mt-6 space-y-3">{progress.activities.map((activity) => <div key={activity.id} className="flex items-center justify-between rounded-xl bg-background-secondary p-4"><div><p className="font-semibold text-foreground">{activity.title}</p><p className="mt-1 text-sm text-muted-foreground">{activity.detail}</p></div><p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleDateString()}</p></div>)}</div> : <EmptyState />}
          </section>

          <SusieNote className="p-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Susie&apos;s note</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Small steps count.</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Your dashboard starts fresh on every new browser. Check a step or complete a quiz to begin your own record.</p>
            <Link href="/practice" className="button-primary mt-6 inline-flex items-center gap-2 px-5 py-3">Check a maths step <CheckCircle2 className="h-4 w-4" /></Link>
          </SusieNote>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-12 text-center"><CircleDashed className="h-8 w-8 text-primary" /><p className="mt-3 font-semibold text-foreground">Nothing here yet</p><p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Your learning record will appear here as you practise.</p></div>
}
