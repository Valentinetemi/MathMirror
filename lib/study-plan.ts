export type StudyPlan = {
  courseName: string
  syllabusName: string
  createdAt: string
  topics: { title: string; description: string; complete: boolean }[]
  order: 'easy' | 'hard' | null
}

const PLAN_KEY = 'mathmirror-study-plan-v1'

const coreTopics = [
  { title: 'Algebra foundations', description: 'Expressions, terms, and simplifying with confidence.' },
  { title: 'Solving equations', description: 'Use inverse operations to find the unknown.' },
  { title: 'Expanding and factorising', description: 'Work with brackets, patterns, and quadratics.' },
  { title: 'Indices and surds', description: 'Use exponent rules and simplify roots.' },
  { title: 'Functions and graphs', description: 'Connect equations to patterns you can see.' },
]

export function createPlan(courseName: string, syllabusName: string, syllabusText = ''): StudyPlan {
  const text = `${courseName} ${syllabusText}`.toLowerCase()
  const topics = [...coreTopics]
  if (text.includes('trigon') || text.includes('sin') || text.includes('cos')) topics.push({ title: 'Trigonometry', description: 'Use right-triangle relationships and solve for missing values.' })
  if (text.includes('geometry') || text.includes('shape')) topics.push({ title: 'Geometry', description: 'Apply angle, shape, and measurement rules.' })
  if (text.includes('statistic') || text.includes('probability')) topics.push({ title: 'Statistics and probability', description: 'Read data, describe patterns, and reason about chance.' })
  return { courseName: courseName.trim() || 'My maths course', syllabusName, createdAt: new Date().toISOString(), order: null, topics: topics.map(topic => ({ ...topic, complete: false })) }
}

/** Builds a plan from a topic list the AI extracted from a real syllabus, instead of the keyword-matched starter set. */
export function createPlanFromTopics(courseName: string, syllabusName: string, topics: { title: string; description: string }[]): StudyPlan {
  return { courseName: courseName.trim() || 'My maths course', syllabusName, createdAt: new Date().toISOString(), order: null, topics: topics.map(topic => ({ ...topic, complete: false })) }
}

export function getStudyPlan(): StudyPlan | null {
  if (typeof window === 'undefined') return null
  try { const value = localStorage.getItem(PLAN_KEY); return value ? JSON.parse(value) : null } catch { return null }
}

export function saveStudyPlan(plan: StudyPlan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan))
  window.dispatchEvent(new Event('mathmirror-plan-updated'))
}

export function toggleTopic(index: number) {
  const plan = getStudyPlan()
  if (!plan) return
  plan.topics[index].complete = !plan.topics[index].complete
  saveStudyPlan({ ...plan })
}

export function setLearningOrder(order: 'easy' | 'hard') {
  const plan = getStudyPlan()
  if (plan) saveStudyPlan({ ...plan, order })
}

export function completeTopic(title: string) {
  const plan = getStudyPlan()
  if (!plan) return
  saveStudyPlan({ ...plan, topics: plan.topics.map(topic => topic.title === title ? { ...topic, complete: true } : topic) })
}

export function getOrderedTopics(plan: StudyPlan) {
  return plan.order === 'hard' ? [...plan.topics].reverse() : plan.topics
}

export function getNextTopic(plan: StudyPlan, currentTitle: string) {
  const ordered = getOrderedTopics(plan)
  const index = ordered.findIndex(topic => topic.title === currentTitle)
  if (index === -1) return null
  return ordered[index + 1] || null
}
