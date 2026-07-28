'use client'

import { LogIn, Sparkles, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DemoSignIn() {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    setSignedIn(window.localStorage.getItem('mathmirror-demo-user') === 'true')
  }, [])

  const toggleSignIn = () => {
    const nextValue = !signedIn
    window.localStorage.setItem('mathmirror-demo-user', String(nextValue))
    setSignedIn(nextValue)
  }

  return (
    <button
      onClick={toggleSignIn}
      className={signedIn ? 'demo-user-button' : 'button-outline inline-flex items-center gap-2 px-4 py-2 text-sm'}
      aria-label={signedIn ? 'Sign out of demo profile' : 'Use demo profile'}
      title={signedIn ? 'Sign out' : 'No account needed — use the demo profile'}
    >
      {signedIn ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
      <span>{signedIn ? 'Alex · Demo' : 'Try demo'}</span>
      {!signedIn && <Sparkles className="h-3.5 w-3.5" />}
    </button>
  )
}
