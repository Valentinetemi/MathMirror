'use client'

export function PageTitle({ topic }: { topic?: string }) {
  return (
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
          {topic ? <>Show Susie your <span className="text-primary">{topic}</span> working</> : <>Show Susie <span className="text-primary">your working</span></>}
        </h1>
        {/* Hand-drawn style pencil squiggle accent */}
        <svg
          className="w-10 h-10 text-accent animate-float"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Pencil tip */}
          <path d="M17.5 3.5L20.5 6.5M3 21h7l10-10-7-7-10 10v7z" />
          {/* Subtle squiggle for hand-drawn feel */}
          <path d="M8 15c1 1 2 0 3 1" opacity="0.6" />
        </svg>
      </div>
      <p className="explanation-text text-muted-foreground text-lg">
        Upload a clear photo of your solution, or type the step where you got stuck.
      </p>
    </div>
  )
}
