'use client'

import { CheckCircle, XCircle, SkipForward } from 'lucide-react'
import { useState } from 'react'
import type { QuizQuestion } from '@/lib/lesson-content'

interface MasteryQuizProps {
  questions: QuizQuestion[]
  /** How many correct answers count as a pass. Defaults to 80% of the set (4/5). */
  passThreshold?: number
  onComplete?: (correct: number, total: number) => void
  renderResultActions?: (result: { correct: number; total: number; passed: boolean }) => React.ReactNode
}

export function MasteryQuiz({ questions, passThreshold, onComplete, renderResultActions }: MasteryQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  const current = questions[currentIndex]
  const answered = answers[currentIndex] !== null
  const correctCount = answers.filter((ans, idx) => ans === questions[idx].correct).length
  const threshold = passThreshold ?? Math.ceil(questions.length * 0.8)
  const passed = correctCount >= threshold

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    onComplete?.(correctCount, questions.length)
    setShowResults(true)
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setAnswers(new Array(questions.length).fill(null))
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="space-y-8">
        <div className="premium-card p-8 text-center">
          <div className="text-6xl font-bold text-primary mb-2">{correctCount}/{questions.length}</div>
          <p className="text-xl text-foreground mb-4">
            {correctCount === questions.length
              ? 'Perfect score! You really understand these concepts!'
              : passed
              ? 'Great job! You\'re on the right track!'
              : 'Keep practicing! Review the concepts and try again.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={handleRetry} className="button-primary px-6 py-3">Try Again</button>
            {renderResultActions?.({ correct: correctCount, total: questions.length, passed })}
          </div>
        </div>

        <div className="premium-card p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Review Answers</h2>
          {questions.map((quiz, idx) => (
            <div key={quiz.id} className="p-4 rounded-xl bg-background-secondary">
              <div className="flex items-center gap-2 mb-2">
                {answers[idx] === quiz.correct ? <CheckCircle className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-accent" />}
                <p className="font-medium text-foreground">{quiz.question}</p>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                Your answer: {quiz.options[answers[idx] ?? 0]}
                {answers[idx] !== quiz.correct && <span className="text-primary block mt-1">Correct answer: {quiz.options[quiz.correct]}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
        <div className="w-full bg-border rounded-full h-2 mt-4">
          <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="premium-card p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">{current.question}</h2>
        <div className="space-y-3">
          {current.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${answers[currentIndex] === idx ? 'border-primary bg-primary/10 border' : 'bg-white border border-border hover:border-primary/40 hover:bg-primary/5'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 ${answers[currentIndex] === idx ? 'border-primary bg-primary' : 'border-border'}`}></div>
                <span className="text-foreground font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-between">
        <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} className="button-outline px-6 py-3 disabled:opacity-50">Previous</button>
        {currentIndex === questions.length - 1 ? (
          <button onClick={handleSubmit} disabled={!answered} className="button-primary px-6 py-3 disabled:opacity-50">Submit Quiz</button>
        ) : (
          <button onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))} className="button-outline px-6 py-3 flex items-center gap-2"><span>Next</span><SkipForward className="w-4 h-4" /></button>
        )}
      </div>
    </div>
  )
}
