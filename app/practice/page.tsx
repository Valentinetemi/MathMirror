'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import InputBox from '@/components/input-box'
import MisconceptionBadge from '@/components/misconception-badge'
import AnimatedCorrection from '@/components/animated-correction'
import SocraticHint from '@/components/socratic-hint'
import HistoryStrip from '@/components/history-strip'
import { PageTitle } from '@/components/page-title'
import { misconceptions } from '@/lib/misconceptions'
import { analyzeSubmission } from '@/lib/analyze'
import { recordPractice } from '@/lib/progress'

export default function PracticePage() {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [currentMisconception, setCurrentMisconception] = useState<typeof misconceptions[0] | null>(null)
  const [showFullExplanation, setShowFullExplanation] = useState(false)
  const [history, setHistory] = useState<typeof misconceptions[0][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState('')

  useEffect(() => setTopic(new URLSearchParams(window.location.search).get('topic') || ''), [])

  const handleSubmit = async (data: { text?: string; image?: File }) => {
    setIsLoading(true)
    const matched = await analyzeSubmission(data, topic)
    setCurrentMisconception(matched)
    setHistory([...history, matched])
    setSubmitted(true)
    setShowFullExplanation(false)
    setInput('')
    recordPractice()
    setIsLoading(false)
  }

  const handleReset = () => {
    setSubmitted(false)
    setCurrentMisconception(null)
    setShowFullExplanation(false)
    setInput('')
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <PageTitle topic={topic} />

        {/* Main Content */}
        <div className="space-y-8">
          {!submitted ? (
            <>
              {/* Input Section */}
              <div className="space-y-4">
                <InputBox onSubmit={handleSubmit} value={input} onChange={setInput} isLoading={isLoading} />
                <p className="text-xs text-muted-foreground text-center">
                  Try: (x + 2)² = x² + 4 or √(a + b) = √a + √b
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Result Section */}
              {currentMisconception && (
                <div className="space-y-6">
                  {/* Misconception Badge */}
                  <MisconceptionBadge 
                    label={currentMisconception.misconception}
                    description={currentMisconception.description}
                  />

                  {/* Socratic Hint */}
                  <SocraticHint
                    hint={currentMisconception.hint}
                    onShowExplanation={() => setShowFullExplanation(true)}
                    showExplanation={showFullExplanation}
                    explanation={currentMisconception.explanation}
                  />

                  {/* Animated Correction */}
                  {showFullExplanation && (
                    <AnimatedCorrection
                      wrong={currentMisconception.wrong}
                      steps={currentMisconception.steps}
                      correct={currentMisconception.correct}
                    />
                  )}

                  {/* Try Again Button */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button onClick={handleReset} className="button-outline w-full">Try another problem</button>
                    <Link href={topic ? `/quiz?topic=${encodeURIComponent(topic)}` : '/quiz'} className="button-primary w-full text-center">Take your 5-question check-in</Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* History Strip */}
        {history.length > 0 && <HistoryStrip history={history} />}
      </div>
    </div>
  )
}
