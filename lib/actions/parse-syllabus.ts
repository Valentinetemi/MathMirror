'use server'

import { GoogleGenAI } from '@google/genai'

export type ParsedTopic = { title: string; description: string }

export type ParseSyllabusResult =
  | { ok: true; topics: ParsedTopic[] }
  | { ok: false; error: string }

const TOPIC_LIST_SCHEMA = {
  type: 'object',
  properties: {
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Short topic name, 2-5 words' },
          description: { type: 'string', description: 'One sentence describing what the student will learn' },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: ['topics'],
} as const

/** Turns a raw syllabus into an ordered list of mastery-roadmap topics via Gemini.
 *  Runs server-side only — the API key never reaches the browser. */
export async function parseSyllabusWithAI(courseName: string, syllabusText: string): Promise<ParseSyllabusResult> {
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, error: 'No Gemini API key is configured on the server. Set GEMINI_API_KEY in .env.local (get a free key at aistudio.google.com/apikey) and restart the dev server.' }
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents:
        'You turn a course syllabus into an ordered list of learning topics for a student mastery roadmap. ' +
        'Order topics so foundational topics come before the topics that depend on them. ' +
        'Keep each title short (2-5 words) and each description to one plain sentence.\n\n' +
        `Course: ${courseName || 'Untitled course'}\n\nSyllabus:\n${syllabusText}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: TOPIC_LIST_SCHEMA,
      },
    })

    const text = response.text
    if (!text) return { ok: false, error: "Susie's AI didn't return a readable response." }

    const parsed = JSON.parse(text) as { topics: ParsedTopic[] }
    if (!parsed.topics?.length) return { ok: false, error: "Susie's AI couldn't find any topics in that syllabus." }
    return { ok: true, topics: parsed.topics }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Susie's AI couldn't read that syllabus right now." }
  }
}
