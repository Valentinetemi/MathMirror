'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MasteryQuiz } from '@/components/mastery-quiz'
import { genericQuiz } from '@/lib/lesson-content'
import { recordQuiz } from '@/lib/progress'
import { completeTopic } from '@/lib/study-plan'

export default function QuizPage() {
  const [topic, setTopic] = useState('')

  useEffect(() => setTopic(new URLSearchParams(window.location.search).get('topic') || ''), [])

  const handleComplete = (correct: number, total: number) => {
    recordQuiz(correct, total)
    if (topic && correct >= Math.ceil(total * 0.8)) completeTopic(topic)
  }

  return (
    <div className="min-h-screen bg-background-secondary px-4 py-12 sm:px-6">
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Susie&apos;s check-in</p>
          <h1 className="text-4xl font-bold text-foreground mt-2">A quick confidence check</h1>
          <p className="text-muted-foreground mt-2">A few questions to see what feels clear.</p>
        </div>

        <MasteryQuiz
          questions={genericQuiz}
          onComplete={handleComplete}
          renderResultActions={({ passed }) => (
            <>
              {topic && (
                <p className="w-full text-sm text-muted-foreground">
                  {passed ? `You passed the ${topic} check-in and can move forward.` : `You need 4 out of 5 to unlock the next ${topic} step. Try the lesson once more, then retake it.`}
                </p>
              )}
              {topic && passed && <Link href="/plan" className="button-outline px-6 py-3">Continue roadmap</Link>}
            </>
          )}
        />
      </div>
    </div>
  )
}
