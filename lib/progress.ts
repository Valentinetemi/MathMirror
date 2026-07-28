export type Activity = {
  id: string
  title: string
  detail: string
  xp: number
  createdAt: string
}

export type Progress = {
  problemsChecked: number
  quizzesCompleted: number
  correctAnswers: number
  totalQuizAnswers: number
  xp: number
  streakDays: number
  lastActiveDate: string | null
  activities: Activity[]
}

const STORAGE_KEY = 'mathmirror-progress-v1'

export const emptyProgress: Progress = {
  problemsChecked: 0,
  quizzesCompleted: 0,
  correctAnswers: 0,
  totalQuizAnswers: 0,
  xp: 0,
  streakDays: 0,
  lastActiveDate: null,
  activities: [],
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

/** Same day → no change, consecutive day → +1, any gap → reset to 1. */
function bumpStreak(progress: Progress): Pick<Progress, 'streakDays' | 'lastActiveDate'> {
  const today = todayKey()
  if (progress.lastActiveDate === today) return { streakDays: progress.streakDays, lastActiveDate: today }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  return { streakDays: progress.lastActiveDate === yesterday ? progress.streakDays + 1 : 1, lastActiveDate: today }
}

export function getProgress(): Progress {
  if (typeof window === 'undefined') return emptyProgress
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyProgress
    return { ...emptyProgress, ...JSON.parse(saved) }
  } catch {
    return emptyProgress
  }
}

function saveProgress(progress: Progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  window.dispatchEvent(new Event('mathmirror-progress-updated'))
}

function addActivity(progress: Progress, activity: Omit<Activity, 'id' | 'createdAt'>): Progress {
  return {
    ...progress,
    activities: [{ ...activity, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...progress.activities].slice(0, 8),
  }
}

export function recordPractice() {
  const progress = getProgress()
  saveProgress(addActivity({ ...progress, ...bumpStreak(progress), problemsChecked: progress.problemsChecked + 1, xp: progress.xp + 10 }, {
    title: 'Checked a maths step', detail: '+10 points', xp: 10,
  }))
}

export function recordQuiz(correctAnswers: number, totalAnswers: number) {
  const progress = getProgress()
  const xp = correctAnswers * 15 + 5
  saveProgress(addActivity({
    ...progress,
    ...bumpStreak(progress),
    quizzesCompleted: progress.quizzesCompleted + 1,
    correctAnswers: progress.correctAnswers + correctAnswers,
    totalQuizAnswers: progress.totalQuizAnswers + totalAnswers,
    xp: progress.xp + xp,
  }, { title: 'Completed a quick quiz', detail: `${correctAnswers}/${totalAnswers} correct · +${xp} points`, xp }))
}

export function resetProgress() {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('mathmirror-progress-updated'))
}
