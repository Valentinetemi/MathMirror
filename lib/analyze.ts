import { misconceptions } from './misconceptions'

export type Misconception = (typeof misconceptions)[number]

/**
 * Simulated handwork analysis: keyword-matches the submitted text against known
 * misconceptions, optionally preferring ones tagged for the current topic.
 * Async + delayed on purpose — this is the seam a real vision-model call
 * (e.g. Claude reading a photo of handwritten work) will replace later.
 */
export function analyzeSubmission(input: { text?: string; image?: File }, topic?: string): Promise<Misconception> {
  const delay = input.image ? 1500 : 300
  const textContent = input.text || ''

  return new Promise((resolve) => {
    setTimeout(() => {
      let matched: Misconception | undefined

      if (textContent.includes('x²') && textContent.includes('+') && textContent.includes('4')) {
        matched = misconceptions.find(m => m.id === 'incomplete-distribution')
      } else if (textContent.includes('√') && (textContent.includes('+') || textContent.includes('-'))) {
        matched = misconceptions.find(m => m.id === 'sqrt-distribution')
      } else if (textContent.includes('²') && textContent.includes('+') && textContent.includes('³')) {
        matched = misconceptions.find(m => m.id === 'exponent-rules')
      }

      if (!matched) {
        const relevant = topic ? misconceptions.filter(m => m.topics.includes(topic)) : []
        const pool = relevant.length ? relevant : misconceptions
        matched = pool[Math.floor(Math.random() * pool.length)]
      }

      resolve(matched)
    }, delay)
  })
}
