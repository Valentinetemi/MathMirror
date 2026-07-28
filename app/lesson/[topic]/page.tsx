'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { BookOpen, CheckCircle2, Eye, ExternalLink, PencilLine, Sparkles, Volume2 } from 'lucide-react'
import InputBox from '@/components/input-box'
import MisconceptionBadge from '@/components/misconception-badge'
import AnimatedCorrection from '@/components/animated-correction'
import SocraticHint from '@/components/socratic-hint'
import { MasteryQuiz } from '@/components/mastery-quiz'
import { SusieNote } from '@/components/susie-note'
import { Susie } from '@/components/susie'
import { ConceptDiagram } from '@/components/concept-diagram'
import { ListenButton } from '@/components/listen-button'
import { getLessonContent } from '@/lib/lesson-content'
import { analyzeSubmission, type Misconception } from '@/lib/analyze'
import { recordPractice, recordQuiz } from '@/lib/progress'
import { completeTopic, getNextTopic, getStudyPlan, type StudyPlan } from '@/lib/study-plan'

const STEP_ORDER = ['concept', 'resource', 'examples', 'practice', 'review', 'quiz', 'mastery'] as const
type StepId = (typeof STEP_ORDER)[number]
const STEP_LABEL: Record<StepId, string> = {
  concept: 'Understand the concept',
  resource: 'Learn from the best resources',
  examples: 'Guided example',
  practice: 'Independent practice',
  review: 'Handwriting review',
  quiz: 'Mastery quiz',
  mastery: 'Mastery',
}

export default function LessonPage() {
  const { topic: rawTopic } = useParams<{ topic: string }>()
  const topic = decodeURIComponent(rawTopic)
  const content = useMemo(() => getLessonContent(topic), [topic])

  const [step, setStep] = useState<StepId>('concept')
  const stepIndex = STEP_ORDER.indexOf(step)

  const [conceptMode, setConceptMode] = useState<'read' | 'visual' | 'listen'>('read')

  const [reviewing, setReviewing] = useState(false)
  const [reviewInput, setReviewInput] = useState('')
  const [misconception, setMisconception] = useState<Misconception | null>(null)

  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null)

  const [plan] = useState<StudyPlan | null>(() => (typeof window === 'undefined' ? null : getStudyPlan()))
  const nextTopic = plan ? getNextTopic(plan, topic) : null

  const quizQuestions = useMemo(() => {
    if (!misconception) return content.quiz
    const related = content.quiz.filter(q => q.relatedMisconceptionId === misconception.id)
    const others = content.quiz.filter(q => q.relatedMisconceptionId !== misconception.id)
    return related.length ? [...related, ...others] : content.quiz
  }, [content.quiz, misconception])

  const handleReviewSubmit = async (data: { text?: string; image?: File }) => {
    setReviewing(true)
    const matched = await analyzeSubmission(data, topic)
    setMisconception(matched)
    recordPractice()
    setReviewing(false)
  }

  const handleQuizComplete = (correct: number, total: number) => {
    recordQuiz(correct, total)
    setQuizResult({ correct, total })
    if (correct >= Math.ceil(total * 0.8)) {
      completeTopic(topic)
      setStep('mastery')
    }
  }

  return (
    <main className="min-h-screen bg-background-secondary px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/plan" className="text-sm font-semibold text-primary">← Back to my roadmap</Link>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-primary">Topic mastery · Step {stepIndex + 1} of {STEP_ORDER.length} · {STEP_LABEL[step]}</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">{topic}</h1>

        <div className="mt-7 space-y-5">
          {stepIndex > 0 && <DoneStep label={`Understood the key idea`} />}

          {step === 'concept' && (
            <section className="premium-card p-6 sm:p-8">
              <div className="flex items-center gap-3"><BookOpen className="h-6 w-6 text-primary" /><h2 className="text-xl font-bold text-foreground">Teach: the key idea</h2></div>

              <div className="mt-4 inline-flex rounded-full bg-background-secondary p-1">
                {([
                  { id: 'read', label: 'Read', icon: BookOpen },
                  { id: 'visual', label: 'Visual', icon: Eye },
                  { id: 'listen', label: 'Listen', icon: Volume2 },
                ] as const).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setConceptMode(id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-smooth ${
                      conceptMode === id ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>

              {conceptMode === 'read' && <p className="mt-5 leading-7 text-muted-foreground">{content.concept}</p>}

              {conceptMode === 'visual' && (
                <div className="mt-5">
                  <ConceptDiagram type={content.diagramType} />
                </div>
              )}

              {conceptMode === 'listen' && (
                <div className="mt-5 space-y-4">
                  <p className="leading-7 text-muted-foreground">{content.concept}</p>
                  <ListenButton text={content.concept} />
                </div>
              )}

              <button onClick={() => setStep('resource')} className="button-primary mt-6 px-5 py-3">Continue</button>
              <button onClick={() => setStep('resource')} className="mt-3 block text-sm font-semibold text-secondary hover:underline">
                Prefer a video? Jump to Susie&apos;s recommended resource →
              </button>
            </section>
          )}

          {stepIndex > 1 && <DoneStep label="Looked at a recommended resource" />}

          {step === 'resource' && (
            <section className="premium-card p-6 sm:p-8">
              <div className="flex items-center gap-3"><Sparkles className="h-6 w-6 text-secondary" /><h2 className="text-xl font-bold text-foreground">Learn from the best resources</h2></div>
              <p className="mt-4 leading-7 text-muted-foreground">Sometimes a different explanation helps it click. Many students find this useful:</p>
              <a href={content.resource.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-background-secondary p-5 hover:bg-primary/5">
                <div><p className="font-bold text-foreground">{content.resource.title}</p><p className="mt-1 text-sm text-muted-foreground">{content.resource.description}</p></div>
                <ExternalLink className="h-5 w-5 shrink-0 text-primary" />
              </a>
              <button onClick={() => setStep('examples')} className="button-primary mt-6 px-5 py-3">Continue to a guided example</button>
            </section>
          )}

          {stepIndex > 2 && <DoneStep label="Worked through a guided example" />}

          {step === 'examples' && (
            <section className="premium-card p-6 sm:p-8">
              <div className="flex items-center gap-3"><BookOpen className="h-6 w-6 text-primary" /><h2 className="text-xl font-bold text-foreground">Guided example</h2></div>
              <div className="mt-6 rounded-2xl bg-background-secondary p-5">
                <p className="font-mono text-xl font-bold text-foreground">{content.guidedExample.expression}</p>
                <ol className="mt-4 space-y-3">
                  {content.guidedExample.steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm leading-6 text-foreground"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{i + 1}</span>{s}</li>
                  ))}
                </ol>
              </div>
              <button onClick={() => setStep('practice')} className="button-primary mt-6 px-5 py-3">Continue to independent practice</button>
            </section>
          )}

          {stepIndex > 3 && <DoneStep label="Solved practice questions on paper" />}

          {step === 'practice' && (
            <SusieNote className="p-6 sm:p-8">
              <div className="flex items-center gap-2 font-bold text-foreground"><PencilLine className="h-5 w-5 text-primary" /> Independent practice</div>
              <p className="mt-3 leading-7 text-muted-foreground">Great! Now it&apos;s your turn. Take out a sheet of paper and solve these:</p>
              <ol className="mt-4 space-y-2">
                {content.paperPractice.map((q, i) => <li key={q} className="font-mono text-lg font-bold text-foreground">{i + 1}. {q}</li>)}
              </ol>
              <button onClick={() => setStep('review')} className="button-primary mt-6 px-5 py-3">I&apos;m finished — show Susie my work</button>
            </SusieNote>
          )}

          {stepIndex > 4 && <DoneStep label={misconception ? `Reviewed your working · ${misconception.misconception}` : 'Reviewed your working'} />}

          {step === 'review' && (
            <section className="premium-card p-6 sm:p-8">
              {!misconception ? (
                <>
                  <h2 className="text-xl font-bold text-foreground">Show Susie your working</h2>
                  <p className="mt-2 text-muted-foreground">Upload a clear photo of your solution, or type the step where you got stuck.</p>
                  <div className="mt-5"><InputBox onSubmit={handleReviewSubmit} value={reviewInput} onChange={setReviewInput} isLoading={reviewing} /></div>
                </>
              ) : (
                <div className="space-y-6">
                  <MisconceptionBadge label={misconception.misconception} description={misconception.description} />
                  <SocraticHintReveal misconception={misconception} />
                  <button onClick={() => setStep('quiz')} className="button-primary px-5 py-3">Continue to your mastery quiz</button>
                </div>
              )}
            </section>
          )}

          {stepIndex > 5 && quizResult && <DoneStep label={`Took the mastery quiz · ${quizResult.correct}/${quizResult.total}`} />}

          {step === 'quiz' && (
            <section className="premium-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground">A quick mastery check</h2>
              <p className="mt-2 text-muted-foreground">{misconception ? `A few questions, with extra focus on ${misconception.misconception.toLowerCase()}.` : 'A few questions to confirm this has clicked.'}</p>
              <div className="mt-6">
                <MasteryQuiz
                  questions={quizQuestions}
                  onComplete={handleQuizComplete}
                  renderResultActions={({ passed }) => !passed && (
                    <>
                      <button onClick={() => setStep('resource')} className="button-outline px-6 py-3">Watch the resource again</button>
                      <button onClick={() => setStep('examples')} className="button-outline px-6 py-3">Review the example again</button>
                    </>
                  )}
                />
              </div>
            </section>
          )}

          {step === 'mastery' && (
            <SusieNote tone="celebrate" className="p-6 text-center sm:p-8">
              <Susie mood="celebrate" size={64} className="mx-auto text-accent-warning" />
              <h2 className="mt-4 text-2xl font-bold">You&apos;ve mastered {topic}!</h2>
              {quizResult && <p className="mt-2 text-white/80">You scored {quizResult.correct}/{quizResult.total} on your mastery quiz.</p>}
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {nextTopic ? (
                  <Link href={`/lesson/${encodeURIComponent(nextTopic.title)}`} className="button-primary px-6 py-3">Continue to {nextTopic.title}</Link>
                ) : (
                  <Link href="/plan" className="button-primary px-6 py-3">You&apos;ve completed your roadmap!</Link>
                )}
                <Link href="/plan" className="button-outline border-white/40 px-6 py-3 text-white hover:bg-white/10">Back to my roadmap</Link>
              </div>
            </SusieNote>
          )}
        </div>
      </div>
    </main>
  )
}

function DoneStep({ label }: { label: string }) {
  return <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary animate-slideIn"><CheckCircle2 className="h-4 w-4 shrink-0" /> {label}</div>
}

function SocraticHintReveal({ misconception }: { misconception: Misconception }) {
  const [showExplanation, setShowExplanation] = useState(false)
  return (
    <>
      <SocraticHint hint={misconception.hint} onShowExplanation={() => setShowExplanation(true)} showExplanation={showExplanation} explanation={misconception.explanation} />
      {showExplanation && <AnimatedCorrection wrong={misconception.wrong} steps={misconception.steps} correct={misconception.correct} />}
    </>
  )
}
