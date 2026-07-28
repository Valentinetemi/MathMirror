'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ListenButton({ text }: { text: string }) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => window.speechSynthesis?.cancel()
  }, [])

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  if (!supported) return null

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-smooth ${
        speaking ? 'bg-secondary text-white' : 'border border-primary/30 text-primary hover:bg-primary/5'
      }`}
    >
      {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {speaking ? 'Stop listening' : 'Listen to this'}
    </button>
  )
}
