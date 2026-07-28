export type QuizQuestion = {
  id: number
  question: string
  options: string[]
  correct: number
  /** Ties this question to a misconceptions.ts id — used to prioritise questions
   *  related to whatever mistake showed up during handwriting review. A
   *  heuristic stand-in for real adaptive quiz generation, not the real thing. */
  relatedMisconceptionId?: string
}

export type DiagramType =
  | 'like-terms'
  | 'balance-scale'
  | 'bracket-grid'
  | 'power-tower'
  | 'graph-plot'
  | 'right-triangle'
  | 'angle-sum'
  | 'bar-chart'
  | 'graph-point'

export type LessonContent = {
  concept: string
  diagramType: DiagramType
  resource: { title: string; description: string; url: string }
  guidedExample: { expression: string; steps: string[] }
  paperPractice: string[]
  quiz: QuizQuestion[]
}

/** Generic quiz bank used when a topic has no tailored questions yet. */
export const genericQuiz: QuizQuestion[] = [
  { id: 1, question: 'What is (x + 3)²?', options: ['x² + 9', 'x² + 6x + 9', 'x + 9', 'x² + 3x + 9'], correct: 1, relatedMisconceptionId: 'incomplete-distribution' },
  { id: 2, question: 'Simplify √(a² + b²)', options: ['a + b', '√a + √b', 'Cannot be simplified', 'a² + b²'], correct: 2, relatedMisconceptionId: 'sqrt-distribution' },
  { id: 3, question: 'What is (x²)³?', options: ['x⁵', 'x⁶', 'x⁸', 'x²⁷'], correct: 1, relatedMisconceptionId: 'exponent-rules' },
  { id: 4, question: 'Solve 2x + 7 = 15.', options: ['x = 3', 'x = 4', 'x = 11', 'x = 8'], correct: 1 },
  { id: 5, question: 'Which expression is equivalent to 3(x + 4)?', options: ['3x + 4', '3x + 7', '3x + 12', 'x + 12'], correct: 2 },
]

const genericResource = { title: 'Explore this on Khan Academy', description: 'Free lessons and practice from a trusted source, in case a video explains it better than words on a screen.', url: 'https://www.khanacademy.org/math' }

const content: Record<string, LessonContent> = {
  'Algebra foundations': {
    concept: 'An algebraic expression is made from numbers, letters, and operations. Like terms are terms with the same letter and power — only like terms can be combined.',
    diagramType: 'like-terms',
    resource: { title: 'Algebra basics on Khan Academy', description: 'Many students find combining like terms clicks faster after seeing it done a few times.', url: 'https://www.khanacademy.org/math/algebra-basics' },
    guidedExample: { expression: '3x + 2x - 4', steps: ['Find the like terms: 3x and 2x.', 'Add their coefficients: 3 + 2 = 5.', 'Keep the constant -4.', 'Your simplified expression is 5x - 4.'] },
    paperPractice: ['Simplify: 4y + 7 - 2y + 5.', 'Simplify: 6a - 2 + a - 5.'],
    quiz: [
      { id: 1, question: 'Simplify: 5y + 3 - 2y', options: ['3y + 3', '7y + 3', '3y - 3', '5y + 1'], correct: 0 },
      { id: 2, question: 'Simplify: 8 - 3x + 2x', options: ['8 - x', '8 - 5x', '8 + x', '5x'], correct: 0 },
      { id: 3, question: 'Which term is a like term to 4x?', options: ['4', 'x²', '7x', '4y'], correct: 2 },
      { id: 4, question: 'Simplify: 2a + 3a - a', options: ['4a', '5a', '6a', '3a'], correct: 0 },
      { id: 5, question: 'Simplify: -2x + 5x', options: ['3x', '-3x', '7x', '-7x'], correct: 0 },
    ],
  },
  'Solving equations': {
    concept: 'An equation is balanced. Whatever you do to one side, you must do to the other.',
    diagramType: 'balance-scale',
    resource: { title: 'Linear equations on Khan Academy', description: 'A different explanation of the balance idea can help it stick.', url: 'https://www.khanacademy.org/math/algebra-basics' },
    guidedExample: { expression: '3x + 4 = 19', steps: ['Subtract 4 from both sides.', 'You get 3x = 15.', 'Divide both sides by 3.', 'x = 5.'] },
    paperPractice: ['Solve: 5x - 6 = 24.', 'Solve: 4x + 9 = 33.'],
    quiz: [
      { id: 1, question: 'Solve: 2x + 7 = 15', options: ['x = 3', 'x = 4', 'x = 11', 'x = 8'], correct: 1 },
      { id: 2, question: 'Solve: 3x - 5 = 10', options: ['x = 5', 'x = 3', 'x = 15', 'x = 1'], correct: 0 },
      { id: 3, question: 'Solve: x/2 + 1 = 6', options: ['x = 10', 'x = 5', 'x = 12', 'x = 7'], correct: 0 },
      { id: 4, question: 'What is the first step to solve 4x + 3 = 19?', options: ['Divide both sides by 4', 'Subtract 3 from both sides', 'Add 3 to both sides', 'Multiply both sides by 4'], correct: 1 },
      { id: 5, question: 'Solve: 6 - x = 2', options: ['x = 4', 'x = -4', 'x = 8', 'x = -8'], correct: 0 },
    ],
  },
  'Expanding and factorising': {
    concept: 'To expand brackets, multiply every term in the first bracket by every term in the second.',
    diagramType: 'bracket-grid',
    resource: { title: 'Expanding brackets on Khan Academy', description: 'Seeing the grid/area method can make the double-distribution click.', url: 'https://www.khanacademy.org/math/algebra' },
    guidedExample: { expression: '(x + 2)(x + 3)', steps: ['Multiply x by x and 3.', 'Multiply 2 by x and 3.', 'Write x² + 3x + 2x + 6.', 'Combine like terms: x² + 5x + 6.'] },
    paperPractice: ['Expand: (x + 4)(x + 2).', 'Expand: (x + 1)(x + 5).'],
    quiz: [
      { id: 1, question: 'What is (x + 3)²?', options: ['x² + 9', 'x² + 6x + 9', 'x + 9', 'x² + 3x + 9'], correct: 1, relatedMisconceptionId: 'incomplete-distribution' },
      { id: 2, question: 'Expand: (x + 2)(x + 3)', options: ['x² + 6', 'x² + 5x + 6', 'x² + 6x + 5', '2x + 5'], correct: 1 },
      { id: 3, question: 'Expand: 3(x + 4)', options: ['3x + 4', '3x + 7', '3x + 12', 'x + 12'], correct: 2 },
      { id: 4, question: 'Expand: (x - 2)(x + 2)', options: ['x² - 4', 'x² + 4', 'x² - 4x + 4', 'x² - 2'], correct: 0 },
      { id: 5, question: 'Factorise: x² + 5x + 6', options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+5)(x+1)', '(x+6)(x-1)'], correct: 0 },
    ],
  },
  'Indices and surds': {
    concept: 'When multiplying powers with the same base, add the exponents. For a power raised to a power, multiply the exponents.',
    diagramType: 'power-tower',
    resource: { title: 'Exponents on Khan Academy', description: 'Worth a look if adding vs. multiplying exponents feels shaky.', url: 'https://www.khanacademy.org/math/algebra' },
    guidedExample: { expression: '(x²)³', steps: ['Write it as x² × x² × x².', 'Add the exponents: 2 + 2 + 2.', 'That gives x⁶.', 'Equivalently, 2 × 3 = 6.'] },
    paperPractice: ['Simplify: (y³)².', 'Simplify: √(9 + 16), then compare it to √9 + √16.'],
    quiz: [
      { id: 1, question: 'Simplify √(a² + b²)', options: ['a + b', '√a + √b', 'Cannot be simplified', 'a² + b²'], correct: 2, relatedMisconceptionId: 'sqrt-distribution' },
      { id: 2, question: 'What is (x²)³?', options: ['x⁵', 'x⁶', 'x⁸', 'x²⁷'], correct: 1, relatedMisconceptionId: 'exponent-rules' },
      { id: 3, question: 'Simplify: x⁴ × x²', options: ['x⁶', 'x⁸', 'x²', 'x⁶⁺²'], correct: 0 },
      { id: 4, question: 'What is √25 + √9?', options: ['√34', '8', '5.83', '15'], correct: 1 },
      { id: 5, question: 'Simplify: (y³)²', options: ['y⁵', 'y⁶', 'y⁹', 'y²'], correct: 1 },
    ],
  },
  'Functions and graphs': {
    concept: 'A function links every input to exactly one output. A graph lets you see that relationship.',
    diagramType: 'graph-plot',
    resource: { title: 'Functions on Khan Academy', description: 'Plotting a few points alongside the algebra often makes it click.', url: 'https://www.khanacademy.org/math/algebra' },
    guidedExample: { expression: 'y = 2x + 1', steps: ['Choose an x-value, such as 2.', 'Substitute it: y = 2(2) + 1.', 'y = 5.', 'So the point (2, 5) lies on the graph.'] },
    paperPractice: ['For y = 3x - 2, find y when x = 4.', 'For y = -x + 6, find y when x = 3.'],
    quiz: [
      { id: 1, question: 'For y = 2x + 1, what is y when x = 3?', options: ['5', '6', '7', '8'], correct: 2 },
      { id: 2, question: 'What does the graph of y = 3x + 2 cross the y-axis at?', options: ['(0, 3)', '(0, 2)', '(2, 0)', '(3, 0)'], correct: 1 },
      { id: 3, question: 'For y = -x + 4, what is y when x = 4?', options: ['0', '4', '8', '-4'], correct: 0 },
      { id: 4, question: 'Which point lies on y = 2x?', options: ['(1, 1)', '(2, 1)', '(1, 2)', '(0, 2)'], correct: 2 },
      { id: 5, question: 'A function must give each input:', options: ['At least one output', 'Exactly one output', 'Two outputs', 'No output'], correct: 1 },
    ],
  },
  'Trigonometry': {
    concept: 'In a right triangle, sine, cosine, and tangent describe the ratio between two sides, based on a chosen angle.',
    diagramType: 'right-triangle',
    resource: { title: 'Trigonometry on Khan Academy', description: 'SOH-CAH-TOA tends to stick better after seeing it applied a few times.', url: 'https://www.khanacademy.org/math/trigonometry' },
    guidedExample: { expression: 'sin(θ) = opposite / hypotenuse', steps: ['Identify the angle θ you are working from.', 'Label the side opposite that angle.', 'Label the hypotenuse (the side opposite the right angle).', 'Divide opposite by hypotenuse to get sin(θ).'] },
    paperPractice: ['A right triangle has an opposite side of 6 and a hypotenuse of 10. Find sin(θ).', 'A right triangle has an adjacent side of 8 and a hypotenuse of 10. Find cos(θ).'],
    quiz: [
      { id: 1, question: 'Which ratio is sin(θ)?', options: ['opposite/hypotenuse', 'adjacent/hypotenuse', 'opposite/adjacent', 'hypotenuse/opposite'], correct: 0 },
      { id: 2, question: 'Which ratio is cos(θ)?', options: ['opposite/hypotenuse', 'adjacent/hypotenuse', 'opposite/adjacent', 'hypotenuse/adjacent'], correct: 1 },
      { id: 3, question: 'Which ratio is tan(θ)?', options: ['opposite/hypotenuse', 'adjacent/hypotenuse', 'opposite/adjacent', 'hypotenuse/adjacent'], correct: 2 },
      { id: 4, question: 'Opposite = 6, hypotenuse = 10. What is sin(θ)?', options: ['0.6', '0.4', '1.6', '6'], correct: 0 },
      { id: 5, question: 'The hypotenuse is always:', options: ['The shortest side', 'Opposite the right angle', 'Adjacent to every angle', 'Equal to the opposite side'], correct: 1 },
    ],
  },
  'Geometry': {
    concept: 'Angles, shapes, and measurements follow consistent rules — like angles in a triangle always summing to 180°.',
    diagramType: 'angle-sum',
    resource: { title: 'Geometry on Khan Academy', description: 'Seeing the angle rules applied to a few different shapes helps them generalise.', url: 'https://www.khanacademy.org/math/geometry' },
    guidedExample: { expression: 'Angles in a triangle: 70° + 60° + x = 180°', steps: ['Add the two known angles: 70 + 60 = 130.', 'Subtract from 180: 180 - 130 = 50.', 'x = 50°.'] },
    paperPractice: ['A triangle has angles of 90° and 40°. Find the third angle.', 'A quadrilateral has angles 80°, 90°, 100°. Find the fourth angle (they sum to 360°).'],
    quiz: [
      { id: 1, question: 'Angles in a triangle always sum to:', options: ['90°', '180°', '270°', '360°'], correct: 1 },
      { id: 2, question: 'Angles in a quadrilateral always sum to:', options: ['180°', '270°', '360°', '400°'], correct: 2 },
      { id: 3, question: 'A triangle has angles 50° and 60°. What is the third?', options: ['60°', '70°', '80°', '90°'], correct: 1 },
      { id: 4, question: 'Angles on a straight line sum to:', options: ['90°', '180°', '270°', '360°'], correct: 1 },
      { id: 5, question: 'A right angle measures:', options: ['45°', '90°', '180°', '360°'], correct: 1 },
    ],
  },
  'Statistics and probability': {
    concept: 'Statistics describes data using numbers like mean and median. Probability describes how likely an event is, from 0 to 1.',
    diagramType: 'bar-chart',
    resource: { title: 'Statistics and probability on Khan Academy', description: 'Working through a couple of data sets alongside this can help the definitions stick.', url: 'https://www.khanacademy.org/math/statistics-probability' },
    guidedExample: { expression: 'Mean of 4, 8, 6, 10', steps: ['Add the values: 4 + 8 + 6 + 10 = 28.', 'Count the values: there are 4.', 'Divide: 28 ÷ 4 = 7.', 'The mean is 7.'] },
    paperPractice: ['Find the mean of: 5, 7, 9, 11.', 'A bag has 3 red and 7 blue balls. What is the probability of picking red?'],
    quiz: [
      { id: 1, question: 'Find the mean of: 2, 4, 6, 8', options: ['4', '5', '6', '20'], correct: 1 },
      { id: 2, question: 'A bag has 2 red and 8 blue balls. Probability of red?', options: ['1/5', '1/4', '2/10', 'Both 1/5 and 2/10'], correct: 3 },
      { id: 3, question: 'The median of 3, 5, 9 is:', options: ['3', '5', '9', '17'], correct: 1 },
      { id: 4, question: 'A probability of 1 means an event is:', options: ['Impossible', 'Unlikely', 'Certain', 'Random'], correct: 2 },
      { id: 5, question: 'A probability of 0 means an event is:', options: ['Certain', 'Impossible', 'Likely', 'Random'], correct: 1 },
    ],
  },
}

/** Placeholder content for any topic without tailored material yet — the seam a
 *  real AI-generated lesson will replace. Kept honest rather than fabricated. */
function fallbackContent(topic: string): LessonContent {
  return {
    concept: `${topic} is part of your personalised course. Susie will build this out step by step as you work through it.`,
    diagramType: 'graph-point',
    resource: genericResource,
    guidedExample: { expression: 'Start with one example from your notes.', steps: ['Read the key rule.', 'Watch a worked example.', 'Try a similar question on paper.', 'Upload your working for feedback.'] },
    paperPractice: [`Choose one short question on ${topic} from your syllabus and solve it on paper.`],
    quiz: genericQuiz,
  }
}

export function getLessonContent(topic: string): LessonContent {
  return content[topic] || fallbackContent(topic)
}
