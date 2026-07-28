'use client'

import Link from 'next/link'
import { ArrowRight, BookOpenCheck, CheckCircle2, Heart, Lightbulb, PencilLine } from 'lucide-react'
import { Susie } from '@/components/susie'
import { SusieNote } from '@/components/susie-note'

const steps = [
  { icon: PencilLine, title: 'Show your working', text: 'Type a step or snap a photo of the page you are working on.' },
  { icon: Lightbulb, title: 'Find the sticky bit', text: 'Susie helps you spot the exact rule that tripped you up.' },
  { icon: BookOpenCheck, title: 'Try the next step', text: 'Get a small hint first, then the explanation when you are ready.' },
]

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-background-accent" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-sm font-semibold text-secondary shadow-sm">
              <Heart className="h-4 w-4 fill-current text-primary" /> A kinder way to practise algebra
            </div>
            <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Meet Susie, <span className="text-primary">your math tutor.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Bring her the step that has you stuck. Susie will help you slow down, see what happened, and work out a better next move.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/plan" className="button-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base shadow-lg shadow-primary/20">
                Upload my syllabus <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/quiz" className="button-outline inline-flex items-center justify-center px-6 py-3.5 text-base">
                Take a quick quiz
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /> No account needed—just bring a question.</p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-6 top-2 -rotate-12 text-4xl text-accent-warning">✦</div>
            <div className="relative rotate-1 rounded-[1.5rem] border border-border bg-white p-4 shadow-xl shadow-primary/10">
              <div className="flex items-center justify-between rounded-2xl bg-background-accent px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Susie mood="happy" size={32} className="text-primary" /> Susie
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted-foreground">Math tutor</span>
              </div>
              <div className="mt-4 rounded-2xl border border-border/70 p-5">
                <p className="text-sm font-medium text-muted-foreground">I expanded:</p>
                <p className="mt-2 font-mono text-xl font-bold text-foreground">(x + 2)² = x² + 4</p>
              </div>
              <SusieNote tone="note" className="mt-4 border-primary/15 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-secondary"><Heart className="h-4 w-4 fill-current" /> You&apos;re very close!</div>
                <p className="mt-2 text-sm leading-6 text-foreground">Let&apos;s look at it together: what happens when each term in the first bracket multiplies each term in the second?</p>
                <div className="mt-4 rounded-xl bg-white px-3 py-2.5 font-mono text-sm font-semibold text-secondary">x² + 4x + 4</div>
              </SusieNote>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-accent-success/10 p-3 text-sm text-accent-success"><PencilLine className="h-5 w-5" /> One small insight at a time.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">How Susie helps</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Helpful feedback, without the math anxiety.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="premium-card relative p-7">
                <span className="absolute right-6 top-6 text-5xl font-bold text-primary/10">0{index + 1}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-secondary py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SusieNote tone="celebrate" className="rounded-[2rem] px-6 py-14 sm:px-12">
            <Susie mood="celebrate" size={56} className="mx-auto text-accent-warning" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Stuck on the next step?</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">Show Susie the work you already have. You&apos;ll figure out the rest together.</p>
            <Link href="/plan" className="button-primary mt-7 inline-flex items-center gap-2 px-6 py-3.5 shadow-sm">Make my study plan <ArrowRight className="h-5 w-5" /></Link>
          </SusieNote>
        </div>
      </section>
    </main>
  )
}
