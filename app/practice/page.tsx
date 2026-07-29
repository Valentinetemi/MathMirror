'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import InputBox from '@/components/input-box'
import MisconceptionBadge from '@/components/misconception-badge'
import AnimatedCorrection from '@/components/animated-correction'
import SocraticHint from '@/components/socratic-hint'
import HistoryStrip from '@/components/history-strip'
import { PageTitle } from '@/components/page-title'
import { SusieNote } from '@/components/susie-note'
import { Susie } from '@/components/susie'
import { analyzeHandworkWithAI, type AnalyzedMisconception } from '@/lib/actions/analyze-handwriting'
import { fileToBase64 } from '@/lib/utils'
import { recordPractice } from '@/lib/progress'

export default function PracticePage() {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [currentMisconception, setCurrentMisconception] = useState<AnalyzedMisconception | null>(null)
  const [hasMistake, setHasMistake] = useState(true)
  const [showFullExplanation, setShowFullExplanation] = useState(false)
  const [history, setHistory] = useState<AnalyzedMisconception[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [topic, setTopic] = useState('')

  useEffect(() => setTopic(new URLSearchParams(window.location.search).get('topic') || ''), [])

  const handleSubmit = async (data: { text?: string; image?: File }) => {
    setIsLoading(true)
    setError('')
    const imageBase64 = data.image ? await fileToBase64(data.image) : undefined
    const result = await analyzeHandworkWithAI({ text: data.text, imageBase64, imageMimeType: data.image?.type }, topic)
    if (!result.ok) {
      setError(result.error)
      setIsLoading(false)
      return
    }
    setHasMistake(result.hasMistake)
    setCurrentMisconception(result.misconception)
    setHistory([...history, result.misconception])
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
                {error && <div className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">{error}</div>}
              </div>
            </>
          ) : (
            <>
              {/* Result Section */}
              {currentMisconception && (
                hasMistake ? (
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
                ) : (
                  <div className="space-y-6">
                    <SusieNote tone="celebrate" className="text-center">
                      <Susie mood="celebrate" size={48} className="mx-auto text-accent-warning" />
                      <h2 className="mt-3 text-xl font-bold">{currentMisconception.misconception}</h2>
                      <p className="mt-2 text-white/80">{currentMisconception.explanation}</p>
                    </SusieNote>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button onClick={handleReset} className="button-outline w-full">Try another problem</button>
                      <Link href={topic ? `/quiz?topic=${encodeURIComponent(topic)}` : '/quiz'} className="button-primary w-full text-center">Take your 5-question check-in</Link>
                    </div>
                  </div>
                )
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
