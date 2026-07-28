'use client'

import { useEffect, useState } from 'react'

interface Step {
  expression: string
  label: string
  highlight?: boolean
}

interface AnimatedCorrectionProps {
  wrong: string
  steps: Step[]
  correct: string
}

export default function AnimatedCorrection({
  wrong,
  steps,
  correct,
}: AnimatedCorrectionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setTimeout(() => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsAutoPlaying(false)
      }
    }, 1800)

    return () => clearTimeout(timer)
  }, [currentStep, isAutoPlaying, steps.length])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setIsAutoPlaying(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setIsAutoPlaying(false)
    }
  }

  return (
    <div className="premium-card p-8 space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Step-by-Step Correction
        </p>

        {/* Wrong Answer */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Your answer (not quite):</p>
          <div className="math-expression p-4 bg-accent/10 border-l-4 border-accent rounded-lg text-accent text-lg font-mono">
            {wrong}
          </div>
        </div>
      </div>

      {/* Animation Section */}
      <div className="space-y-4 py-6 px-6 bg-background-secondary rounded-lg border border-border/50">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Working through it</p>
        <div className="space-y-3">
          {currentStep > 0 && (
            <>
              {steps.slice(0, currentStep).map((step, idx) => (
                <div key={idx} className="space-y-1 animate-slideIn opacity-100">
                  <div
                    className={`math-expression p-4 rounded-lg font-mono text-lg transition-all ${
                      step.highlight
                        ? 'bg-primary/10 border-l-4 border-primary text-primary'
                        : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {step.expression}
                  </div>
                  <p className="text-xs text-muted-foreground pl-4 font-medium">{step.label}</p>
                </div>
              ))}
            </>
          )}

          {currentStep < steps.length && (
            <div key={currentStep} className="space-y-1 animate-slideIn">
              <div className="math-expression p-4 rounded-lg font-mono text-lg bg-background border-l-4 border-muted text-foreground">
                {steps[currentStep].expression}
              </div>
              <p className="text-xs text-muted-foreground pl-4 font-medium">{steps[currentStep].label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Final Answer */}
      {currentStep >= steps.length && (
        <div className="space-y-2 animate-slideIn">
          <p className="text-sm font-medium text-foreground">Final answer (correct!):</p>
          <div className="math-expression p-6 bg-gradient-to-r from-primary/20 to-primary/10 border-l-4 border-primary rounded-lg text-center text-2xl font-bold text-primary font-mono">
            {correct}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-smooth"
        >
          ← Back
        </button>

        <div className="text-sm font-medium text-muted-foreground">
          Step <span className="text-foreground font-bold">{currentStep}</span> of {steps.length}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStep >= steps.length}
          className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-smooth"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
