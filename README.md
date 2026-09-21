# MathMirror

An AI-tutor-shaped learning app: upload a syllabus, get a mastery roadmap, and work
through each topic in one continuous lesson — taught by Susie — instead of a stack
of disconnected pages.

Built with Next.js 16 (App Router, Turbopack), React 19, and Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No account or API key needed —
everything currently runs client-side against `localStorage`.

## The core loop

1. **`/plan`** — upload a syllabus (or just name a course) to generate a study plan,
   choose simplest → hardest / hardest → simplest / syllabus order, and get a
   roadmap rendered as a winding, dashed path with locked/current/mastered topics.
2. **`/lesson/[topic]`** — a single stateful page that walks through all seven
   mastery steps without ever navigating away:
   `concept → resource → guided example → independent practice → handwriting
   review → mastery quiz → celebration`.
   - The concept step has three real modes: **Read** (text), **Visual** (a
     hand-built SVG diagram per topic), and **Listen** (actual text-to-speech via
     the browser's `speechSynthesis` API).
   - "I'm finished" expands the same page into a photo/text upload — no route
     change — and Susie explains *why* something's wrong, not just that it is.
   - A failed quiz doesn't dead-end; it recommends revisiting the resource or
     example, then lets you retake it.
3. **`/practice`** and **`/quiz`** — the same handwriting-analysis and quiz engine,
   available standalone for quick drilling outside a specific topic.
4. **`/dashboard`** — XP, level, quiz accuracy, and a short activity log, all local
   to the current browser.

## Project structure

```
app/
  page.tsx                 real homepage (served at "/")
  plan/page.tsx             syllabus upload + roadmap
  lesson/[topic]/page.tsx    the one-page mastery flow
  practice/page.tsx          standalone handwriting check
  quiz/page.tsx               standalone quiz
  dashboard/page.tsx          progress overview
  globals.css                design tokens (Tailwind v4 @theme)

components/
  susie.tsx                mascot (SVG, mood-based)
  susie-note.tsx            shared callout panel (note / celebrate tones)
  roadmap-path.tsx           the winding mastery-path visual
  concept-diagram.tsx        per-topic SVG diagrams for the "Visual" mode
  listen-button.tsx          text-to-speech control
  mastery-quiz.tsx           shared quiz UI (used by /quiz and the lesson flow)
  input-box.tsx, misconception-badge.tsx, socratic-hint.tsx,
  animated-correction.tsx, history-strip.tsx   handwriting-review UI

lib/
  study-plan.ts             study plan CRUD + topic ordering/locking (localStorage)
  lesson-content.ts          per-topic concept/resource/example/practice/quiz content
  analyze.ts                 handwriting → misconception matching (simulated)
  misconceptions.ts          the misconception bank analyze.ts matches against
  progress.ts                 XP, streaks, activity log (localStorage)
```
