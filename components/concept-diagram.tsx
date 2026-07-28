import type { DiagramType } from '@/lib/lesson-content'

const CAPTIONS: Record<DiagramType, string> = {
  'like-terms': 'Only terms with the same letter and power can be grouped together.',
  'balance-scale': 'Both sides of an equation carry equal weight — change one side, change the other the same way.',
  'bracket-grid': 'Each cell in the grid is one multiplication — every term meets every term.',
  'power-tower': 'Raising a power to a power means repeating the multiplication that many times.',
  'graph-plot': 'Every point on the line is one (x, y) pair that fits the equation.',
  'right-triangle': 'The ratio you need depends only on which two sides you know, relative to the angle.',
  'angle-sum': 'The three angles inside always add up to the same total.',
  'bar-chart': 'The dashed line marks the mean — the balancing point of all the bars.',
  'graph-point': 'A single idea, placed exactly where it belongs.',
}

export function ConceptDiagram({ type }: { type: DiagramType }) {
  return (
    <figure className="rounded-2xl bg-background-secondary p-6">
      <div className="flex justify-center">
        <Diagram type={type} />
      </div>
      <figcaption className="mt-4 text-center text-sm text-muted-foreground">{CAPTIONS[type]}</figcaption>
    </figure>
  )
}

function Diagram({ type }: { type: DiagramType }) {
  const common = 'w-full max-w-sm'
  switch (type) {
    case 'like-terms':
      return (
        <svg viewBox="0 0 300 140" className={common} fill="none">
          <rect x="12" y="20" width="150" height="60" rx="14" className="stroke-primary" strokeWidth="2" strokeDasharray="6 5" />
          <text x="87" y="14" textAnchor="middle" className="fill-primary text-[11px] font-bold uppercase tracking-wide">like terms</text>
          <rect x="24" y="34" width="56" height="34" rx="8" className="fill-primary" />
          <text x="52" y="56" textAnchor="middle" className="fill-white text-[15px] font-bold font-mono">3x</text>
          <rect x="96" y="34" width="56" height="34" rx="8" className="fill-primary" />
          <text x="124" y="56" textAnchor="middle" className="fill-white text-[15px] font-bold font-mono">2x</text>
          <rect x="204" y="34" width="72" height="34" rx="8" className="fill-muted" />
          <text x="240" y="56" textAnchor="middle" className="fill-foreground text-[15px] font-bold font-mono">-4</text>
          <text x="150" y="112" textAnchor="middle" className="fill-muted-foreground text-[13px] font-mono">3x + 2x − 4 = 5x − 4</text>
        </svg>
      )
    case 'balance-scale':
      return (
        <svg viewBox="0 0 300 150" className={common} fill="none">
          <path d="M150 20v70" className="stroke-muted-foreground" strokeWidth="3" />
          <path d="M150 90l-40 30h80z" className="fill-muted-foreground" />
          <path d="M40 40h220" className="stroke-secondary" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 40l-14 40h28z" className="stroke-secondary" strokeWidth="2.5" fill="none" />
          <path d="M260 40l-14 40h28z" className="stroke-secondary" strokeWidth="2.5" fill="none" />
          <rect x="18" y="10" width="60" height="26" rx="6" className="fill-primary" />
          <text x="48" y="27" textAnchor="middle" className="fill-white text-[12px] font-bold font-mono">3x + 4</text>
          <rect x="230" y="10" width="60" height="26" rx="6" className="fill-primary" />
          <text x="260" y="27" textAnchor="middle" className="fill-white text-[12px] font-bold font-mono">19</text>
        </svg>
      )
    case 'bracket-grid':
      return (
        <svg viewBox="0 0 220 160" className={common} fill="none">
          <text x="70" y="18" textAnchor="middle" className="fill-muted-foreground text-[13px] font-mono">x</text>
          <text x="160" y="18" textAnchor="middle" className="fill-muted-foreground text-[13px] font-mono">3</text>
          <text x="14" y="65" textAnchor="middle" className="fill-muted-foreground text-[13px] font-mono">x</text>
          <text x="14" y="120" textAnchor="middle" className="fill-muted-foreground text-[13px] font-mono">2</text>
          <rect x="30" y="30" width="90" height="60" className="fill-primary/15 stroke-primary" strokeWidth="1.5" />
          <text x="75" y="65" textAnchor="middle" className="fill-primary text-[15px] font-bold font-mono">x²</text>
          <rect x="120" y="30" width="80" height="60" className="fill-secondary/10 stroke-secondary" strokeWidth="1.5" />
          <text x="160" y="65" textAnchor="middle" className="fill-secondary text-[15px] font-bold font-mono">3x</text>
          <rect x="30" y="90" width="90" height="50" className="fill-secondary/10 stroke-secondary" strokeWidth="1.5" />
          <text x="75" y="120" textAnchor="middle" className="fill-secondary text-[15px] font-bold font-mono">2x</text>
          <rect x="120" y="90" width="80" height="50" className="fill-accent-success/15 stroke-accent-success" strokeWidth="1.5" />
          <text x="160" y="120" textAnchor="middle" className="fill-accent-success text-[15px] font-bold font-mono">6</text>
        </svg>
      )
    case 'power-tower':
      return (
        <svg viewBox="0 0 300 140" className={common} fill="none">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={20 + i * 90} y="20" width="70" height="50" rx="10" className="fill-primary" />
              <text x={55 + i * 90} y="52" textAnchor="middle" className="fill-white text-[16px] font-bold font-mono">x²</text>
            </g>
          ))}
          <path d="M20 84h240" className="stroke-muted-foreground" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="150" y="112" textAnchor="middle" className="fill-accent-success text-[16px] font-bold font-mono">x² · x² · x² = x⁶</text>
        </svg>
      )
    case 'graph-plot':
      return (
        <svg viewBox="0 0 260 160" className={common} fill="none">
          <path d="M20 140V20M20 140h220" className="stroke-muted-foreground" strokeWidth="1.5" />
          <path d="M35 130L225 30" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="65" r="6" className="fill-accent-warning" />
          <text x="164" y="60" className="fill-foreground text-[12px] font-bold font-mono">(x, y)</text>
          <text x="228" y="152" className="fill-muted-foreground text-[12px] font-mono">x</text>
          <text x="6" y="24" className="fill-muted-foreground text-[12px] font-mono">y</text>
        </svg>
      )
    case 'right-triangle':
      return (
        <svg viewBox="0 0 260 160" className={common} fill="none">
          <path d="M30 130h180L30 20z" className="stroke-secondary" strokeWidth="3" fill="none" strokeLinejoin="round" />
          <path d="M30 110h20v20h-20z" className="stroke-secondary" strokeWidth="2" />
          <text x="130" y="150" textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">adjacent</text>
          <text x="222" y="80" textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">hyp.</text>
          <text x="14" y="80" textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">opp.</text>
          <text x="55" y="112" className="fill-primary text-[13px] font-bold font-mono">θ</text>
        </svg>
      )
    case 'angle-sum':
      return (
        <svg viewBox="0 0 260 160" className={common} fill="none">
          <path d="M40 130h180L100 20z" className="stroke-secondary" strokeWidth="3" fill="none" strokeLinejoin="round" />
          <path d="M58 130a20 20 0 0 1 20-16" className="stroke-primary" strokeWidth="2" fill="none" />
          <path d="M188 130a20 20 0 0 0-24-14" className="stroke-primary" strokeWidth="2" fill="none" />
          <path d="M90 34a20 20 0 0 0 18 12" className="stroke-primary" strokeWidth="2" fill="none" />
          <text x="150" y="152" textAnchor="middle" className="fill-accent-success text-[14px] font-bold font-mono">a + b + c = 180°</text>
        </svg>
      )
    case 'bar-chart':
      return (
        <svg viewBox="0 0 260 150" className={common} fill="none">
          <path d="M20 130h220" className="stroke-muted-foreground" strokeWidth="1.5" />
          {[40, 75, 55, 95].map((h, i) => (
            <rect key={i} x={40 + i * 50} y={130 - h} width="30" height={h} rx="4" className="fill-primary" />
          ))}
          <path d="M20 65h220" className="stroke-accent-warning" strokeWidth="2" strokeDasharray="5 4" />
          <text x="248" y="61" textAnchor="end" className="fill-accent-warning text-[12px] font-bold font-mono">mean</text>
        </svg>
      )
    case 'graph-point':
    default:
      return (
        <svg viewBox="0 0 220 140" className={common} fill="none">
          <path d="M20 120V16M20 120h180" className="stroke-muted-foreground" strokeWidth="1.5" />
          <circle cx="130" cy="55" r="9" className="fill-primary" />
          <circle cx="130" cy="55" r="16" className="stroke-primary" strokeWidth="1.5" opacity="0.4" />
        </svg>
      )
  }
}
