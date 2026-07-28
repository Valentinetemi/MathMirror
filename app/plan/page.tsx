'use client'

import Link from 'next/link'
import { ArrowDown, ArrowUp, FileText, Sparkles, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { createPlan, createPlanFromTopics, getOrderedTopics, getStudyPlan, saveStudyPlan, setLearningOrder, type StudyPlan } from '@/lib/study-plan'
import { parseSyllabusWithAI } from '@/lib/actions/parse-syllabus'
import { RoadmapPath } from '@/components/roadmap-path'
import { SusieNote } from '@/components/susie-note'

export default function PlanPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(() => typeof window === 'undefined' ? null : getStudyPlan())
  const [courseName, setCourseName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isMakingPlan, setIsMakingPlan] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const makePlan = async () => {
    if (!file && !courseName.trim()) return
    setIsMakingPlan(true)
    setError('')
    const text = file?.type.startsWith('text/') ? await file.text() : ''

    if (text.trim()) {
      const result = await parseSyllabusWithAI(courseName, text)
      if (!result.ok) {
        setError(result.error)
        setIsMakingPlan(false)
        return
      }
      const nextPlan = createPlanFromTopics(courseName, file?.name || 'Your course outline', result.topics)
      saveStudyPlan(nextPlan)
      setPlan(nextPlan)
    } else {
      const nextPlan = createPlan(courseName, file?.name || 'Your course outline', text)
      saveStudyPlan(nextPlan)
      setPlan(nextPlan)
    }
    setIsMakingPlan(false)
  }

  if (plan && !plan.order) return <ChooseOrder plan={plan} onChoose={(order) => { setLearningOrder(order); setPlan(getStudyPlan()) }} />
  if (plan) return <PlanView plan={plan} onStartOver={() => setPlan(null)} />

  return <main className="min-h-screen bg-background-secondary px-4 py-12 sm:px-6"><div className="mx-auto max-w-3xl">
    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Start here</p>
    <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Let&apos;s make your study plan.</h1>
    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">Upload your syllabus or course outline. Susie will turn it into a dependency-aware path: foundations first, then the topics that build on them.</p>
    <section className="premium-card mt-9 p-6 sm:p-8">
      <label className="text-sm font-bold text-foreground" htmlFor="course">What&apos;s this course called?</label>
      <input id="course" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="e.g. SS2 Mathematics" className="premium-input mt-2 w-full px-4 py-3" />
      <input ref={inputRef} type="file" accept=".pdf,.txt,.doc,.docx,image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={() => inputRef.current?.click()} className="mt-5 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-9 text-center transition hover:bg-primary/10">
        <Upload className="h-8 w-8 text-primary" /><span className="mt-3 font-bold text-foreground">{file ? file.name : 'Upload your syllabus'}</span><span className="mt-1 text-sm text-muted-foreground">PDF, document, text file, or clear photo</span>
      </button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">A text outline is read by Susie&apos;s AI directly; document and photo uploads still create a starter plan you can adjust.</p>
      {error && <p className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">{error}</p>}
      <button onClick={makePlan} disabled={isMakingPlan || (!file && !courseName.trim())} className="button-primary mt-6 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-50">{isMakingPlan ? 'Susie is making your plan…' : 'Make my study plan'}</button>
    </section>
  </div></main>
}

function ChooseOrder({ plan, onChoose }: { plan: StudyPlan; onChoose: (order: 'easy' | 'hard') => void }) {
  return <main className="min-h-screen bg-background-secondary px-4 py-12 sm:px-6"><div className="mx-auto max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Syllabus understood</p><h1 className="mt-2 text-4xl font-bold text-foreground">Here&apos;s what&apos;s in your course.</h1><p className="mt-3 text-lg text-muted-foreground">Susie found {plan.topics.length} core topics in <strong>{plan.syllabusName}</strong>. How would you like to work through them?</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><button onClick={() => onChoose('easy')} className="premium-card p-6 text-left hover:border-primary/50"><ArrowUp className="h-8 w-8 text-primary" /><h2 className="mt-4 text-xl font-bold text-foreground">Start with the simplest</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Build the foundations first, then move steadily toward the harder topics.</p></button><button onClick={() => onChoose('hard')} className="premium-card p-6 text-left hover:border-primary/50"><ArrowDown className="h-8 w-8 text-secondary" /><h2 className="mt-4 text-xl font-bold text-foreground">Start with the hardest</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Begin with the challenge you care about most, and fill in gaps as you go.</p></button></div></div></main>
}

function PlanView({ plan, onStartOver }: { plan: StudyPlan; onStartOver: () => void }) {
  const completed = plan.topics.filter(topic => topic.complete).length
  const ordered = getOrderedTopics(plan)
  return <main className="min-h-screen bg-background-secondary px-4 py-12 sm:px-6"><div className="mx-auto max-w-4xl">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{plan.courseName}</p><h1 className="mt-2 text-4xl font-bold text-foreground">Your path to mastery</h1><p className="mt-2 text-muted-foreground">Built from {plan.syllabusName} · {completed}/{plan.topics.length} topics complete</p></div><button onClick={onStartOver} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Upload a different syllabus</button></div>
    <div className="mt-7 h-3 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completed / plan.topics.length) * 100}%` }} /></div>
    <section className="mt-7 rounded-2xl border border-primary/15 bg-primary/5 p-5"><p className="text-sm font-bold text-primary">Every topic follows the same mastery loop, in one continuous lesson</p><div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground"><span>Teach</span><span className="text-primary">→</span><span>Recommended resource</span><span className="text-primary">→</span><span>Guided example</span><span className="text-primary">→</span><span>Paper practice</span><span className="text-primary">→</span><span>Scan & feedback</span><span className="text-primary">→</span><span>Mastery quiz</span><span className="text-primary">→</span><span>Unlock next topic</span></div></section>
    <RoadmapPath topics={ordered} />
    <SusieNote className="mt-8"><div className="flex items-center gap-2 font-bold text-foreground"><Sparkles className="h-5 w-5 text-primary" /> Susie&apos;s next suggestion</div><p className="mt-2 text-muted-foreground">Start with the first unfinished topic, take a quick check-in, then upload your own working when you want feedback.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Link href="/quiz" className="button-primary inline-flex items-center justify-center gap-2 px-5 py-3">Take a topic check-in</Link><Link href="/practice" className="button-outline inline-flex items-center justify-center gap-2 px-5 py-3">Upload my working <FileText className="h-4 w-4" /></Link></div></SusieNote>
  </div></main>
}
