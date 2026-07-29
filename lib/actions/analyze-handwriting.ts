'use server'

import { GoogleGenAI } from '@google/genai'
import { misconceptions } from '@/lib/misconceptions'

export type AnalyzedMisconception = {
  id: string
  misconception: string
  description: string
  wrong: string
  steps: { expression: string; label: string; highlight?: boolean }[]
  correct: string
  hint: string
  explanation: string
}

export type AnalyzeHandworkResult =
  | { ok: true; hasMistake: boolean; misconception: AnalyzedMisconception }
  | { ok: false; error: string }

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    hasMistake: { type: 'boolean', description: 'true if the student made a mathematical error; false if their work is fully correct' },
    misconception: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Reuse an id from the provided misconception bank if it genuinely matches; otherwise invent a new short kebab-case id.' },
        misconception: { type: 'string', description: 'Short name, e.g. "Incomplete Distribution". If hasMistake is false, use something like "Correct!"' },
        description: { type: 'string', description: 'One short phrase describing the mistake, or the correct approach if there is no mistake' },
        wrong: { type: 'string', description: "The student's incorrect final expression or equation. If hasMistake is false, repeat their correct final answer here." },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              expression: { type: 'string' },
              label: { type: 'string' },
              highlight: { type: 'boolean', description: 'true only on the step where the mistake happens' },
            },
            required: ['expression', 'label'],
          },
          description: 'A 3-5 step walkthrough of the correct solution path',
        },
        correct: { type: 'string', description: 'The correct final answer or statement' },
        hint: { type: 'string', description: 'A short Socratic question nudging toward the fix without giving it away. If hasMistake is false, a short encouraging note instead.' },
        explanation: { type: 'string', description: 'Two to three sentences on why the correct approach works and, if applicable, exactly what went wrong' },
      },
      required: ['id', 'misconception', 'description', 'wrong', 'steps', 'correct', 'hint', 'explanation'],
    },
  },
  required: ['hasMistake', 'misconception'],
} as const

const bankSummary = misconceptions
  .map(m => `- id: ${m.id} | name: ${m.misconception} | ${m.description} | relevant topics: ${m.topics.join(', ')}`)
  .join('\n')

/** Reads a student's handwritten (or typed) math work and diagnoses the underlying
 *  misconception via Gemini vision/text input. Runs server-side only. */
export async function analyzeHandworkWithAI(
  input: { text?: string; imageBase64?: string; imageMimeType?: string },
  topic?: string
): Promise<AnalyzeHandworkResult> {
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, error: 'No Gemini API key is configured on the server. Set GEMINI_API_KEY in .env.local and restart the dev server.' }
  }
  if (!input.text?.trim() && !input.imageBase64) {
    return { ok: false, error: 'No work to analyze — type a step or upload a photo first.' }
  }

  const promptText =
    "You are Susie, a patient math tutor reviewing a student's handwritten or typed working. " +
    'Read the work, then determine whether it contains a mathematical error. ' +
    'If it does, diagnose the specific underlying misconception — prefer matching one of the known misconceptions below by reusing its exact id when it genuinely applies; ' +
    "only invent a new id when none of them fit. If the student's work is fully correct, set hasMistake to false and use the misconception fields to give brief, positive feedback instead. " +
    'Never fabricate a mistake that is not actually there.\n\n' +
    `${topic ? `Current topic: ${topic}\n\n` : ''}` +
    `Known misconceptions:\n${bankSummary}\n\n` +
    `${input.text ? `Student's typed work:\n${input.text}` : "The student's work is in the attached image."}`

  const parts: object[] = [{ text: promptText }]
  if (input.imageBase64 && input.imageMimeType) {
    parts.push({ inlineData: { mimeType: input.imageMimeType, data: input.imageBase64 } })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_SCHEMA,
      },
    })

    const text = response.text
    if (!text) return { ok: false, error: "Susie's AI didn't return a readable response." }

    const parsed = JSON.parse(text) as { hasMistake: boolean; misconception: AnalyzedMisconception }
    return { ok: true, hasMistake: parsed.hasMistake, misconception: parsed.misconception }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Susie's AI couldn't read that work right now." }
  }
}
