# MathMirror — project notes

Personal reference doc: what this is, how it's built, and the decisions behind it. `README.md` is the quick-start; this is the fuller story.

## What it is

MathMirror is trying to be an AI tutor, not a chatbot. The core promise: a student uploads a syllabus, gets a personalized mastery roadmap, and works through each topic in **one continuous lesson** — concept, resource, worked example, independent practice, handwriting review, mastery quiz, celebration — taught by a mascot named Susie, instead of clicking between disconnected pages.

That "one continuous lesson" idea is the thing the whole product hangs off. A lot of the engineering decisions below exist to protect it.

## The core loop

```
Upload syllabus → AI extracts topics → roadmap (locked/current/mastered path)
  → pick a topic → one page, no navigation:
     concept (read/visual/listen) → resource → guided example
     → independent practice → "I'm finished" → handwriting review (inline)
     → mastery quiz → celebrate → next topic unlocks
```

`/practice` and `/quiz` also exist standalone, for quick drilling outside a specific topic — they reuse the same underlying logic (`lib/analyze.ts`, `components/mastery-quiz.tsx`) rather than duplicating it.

## Tech stack

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`). No database — study plans and progress live in `localStorage`. One real backend integration: a Next.js Server Action that calls the Gemini API.

## How the pieces fit together

```
app/
  page.tsx                the real homepage (served at "/")
  plan/page.tsx             syllabus upload → roadmap
  lesson/[topic]/page.tsx    the one-page, 7-step mastery flow (the core UX bet)
  practice/, quiz/           standalone versions of two of those steps
  dashboard/page.tsx         XP, streak, activity log
  globals.css                design tokens

components/
  susie.tsx, susie-note.tsx, roadmap-path.tsx, concept-diagram.tsx, listen-button.tsx
  mastery-quiz.tsx                       shared between /quiz and the lesson flow
  input-box.tsx, misconception-badge.tsx, socratic-hint.tsx, animated-correction.tsx
                                          the handwriting-review UI

lib/
  study-plan.ts       plan CRUD, topic ordering/locking (localStorage)
  lesson-content.ts    per-topic concept/resource/example/practice/quiz content
  analyze.ts            handwriting → misconception matching (still simulated)
  misconceptions.ts     the misconception bank analyze.ts matches against
  progress.ts            XP, streaks, activity log (localStorage)
  actions/parse-syllabus.ts   the one real AI call — Gemini, server-side only
```

The `lesson/[topic]/page.tsx` file is the one that matters most: it's a single React component with a `step` state machine (`concept → resource → examples → practice → review → quiz → mastery`). Completed steps collapse to a one-line summary above; the current step is the only interactive thing on the page; future steps don't exist in the DOM yet. That's what makes it feel like one session instead of a wizard.

## The design system — "Violet Play"

- **Palette**: violet primary (`#7c4dff`), deep indigo for depth/celebration moments (`#2e2555`), ink `#1e1b33`, paper `#f4f2fa`. Leaf-green and amber are pinned as *status* colors (mastered / streak) — not brand colors, so they never compete with the primary accent for attention.
- **Susie**: drawn as a point plotted on a graph (SVG, mood-based: neutral/happy/celebrate/thinking), not a generic blob-with-eyes — ties the mascot back to the subject.
- **The roadmap**: a winding dashed path styled like a number line, not a literal copy of a gamified-app trail.
- All of this lives as CSS custom properties in `globals.css`'s `@theme inline` block — components should reference tokens, not hardcoded hex.

## What's real vs. simulated, honestly

- **Real**: syllabus → topic-list extraction (Gemini, structured JSON output), the whole lesson step-machine, streak/XP tracking, the design system.
- **Simulated**: handwriting analysis (`lib/analyze.ts` keyword-matches the submitted text/image metadata against a small misconception bank — no vision model call yet), lesson content for the 8 hardcoded topics (hand-written, not generated), quiz questions (hand-written, tagged to misconceptions for light "adaptivity").
- **Deliberately not attempted**: PDF/photo syllabus uploads still fall back to a keyword-matched starter plan (Gemini's document/vision input could read these directly — real next step, just not done); no real prerequisite graph (topic order is a fixed list reordered by simplest/hardest/syllabus choice, not inferred dependencies).

## The AI integration

`lib/actions/parse-syllabus.ts` is a Next.js Server Action (`'use server'`) — runs only on the server, so the API key never reaches the browser. It sends the syllabus text to Gemini with `responseMimeType: 'application/json'` + `responseSchema` to force strictly-shaped JSON back (an array of `{title, description}`), rather than trying to parse loose prose.

Two real things worth remembering:

1. **The model name drifts fast.** First attempt used `gemini-2.5-flash` (well-documented, seemed safe) — a live test against a real key immediately 404'd: *"this model is no longer available to new users."* Had to move to `gemini-3.6-flash`. If this breaks again later, that's almost certainly why — check `aistudio.google.com` for the current model list before assuming the code is broken.
2. **Free tier ≠ private.** Gemini's free tier terms allow Google to use submitted content to improve their products; the paid tier turns that off. Worth remembering if real student syllabi ever flow through this beyond personal testing.

Error handling is deliberately not graceful-degrade-to-fake: if the AI call fails (no key, bad key, network), the UI shows a clear error and stops — it does not silently fall back to the old keyword-matching heuristic and pretend that's the same thing.

## Notable bugs found and fixed along the way

- **A dead homepage.** `app/(home)/page.tsx` and `app/page.tsx` both existed and both mapped to `/` — Next.js silently served `app/page.tsx` and the route-group version was never rendered. An early product review was accidentally based on reading the wrong (unreachable) file. Deleted the dead one.
- **Half the color system was inert.** `bg-background-secondary`, `text-accent-success`, `text-accent-warning`, and similar custom-named Tailwind classes were used all over the app (before and after the redesign) but were never registered in the `@theme inline` block — Tailwind v4 only generates utilities for tokens explicitly declared there. Every one of those classes was generating zero CSS. Fixed by registering the missing tokens; verified by diffing the actual compiled CSS before/after, not just trusting the class names looked right.

## Where a next session would pick up

- Wire handwriting review to a real vision call (Gemini supports image input directly — same server-action pattern as syllabus parsing).
- Let PDF syllabus uploads go straight to Gemini as a document input instead of falling back to the starter plan.
- A real prerequisite graph instead of a fixed topic list.
- Adaptive quiz generation instead of a hand-tagged static bank.
