'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DemoSignIn } from './demo-sign-in'
import { Susie } from './susie'
import { emptyProgress, getProgress, type Progress } from '@/lib/progress'

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [progress, setProgress] = useState<Progress>(emptyProgress)

  useEffect(() => {
    const refresh = () => setProgress(getProgress())
    refresh()
    window.addEventListener('mathmirror-progress-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('mathmirror-progress-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/plan', label: 'My study plan' },
    { href: '/practice', label: 'Practice' },
    { href: '/dashboard', label: 'Progress' },
    { href: '/quiz', label: 'Quick quiz' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-white/90 shadow-sm backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Susie mood="neutral" size={34} className="text-primary transition-smooth group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-base text-foreground">MathMirror</span>
              <span className="text-xs text-secondary font-semibold tracking-wide">with Susie</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-smooth transform hover:scale-105 ${
                  pathname === item.href
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-background-secondary rounded-lg transition-smooth"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center gap-2">
            <ProgressPills progress={progress} />
            <DemoSignIn />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background-secondary py-4 space-y-2 animate-slideIn">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-4 border-t border-border flex items-center justify-between gap-2">
              <ProgressPills progress={progress} />
              <DemoSignIn />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function ProgressPills({ progress }: { progress: Progress }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      {progress.streakDays > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-background-accent px-2.5 py-1.5 text-accent-warning">
          🔥 {progress.streakDays}
        </span>
      )}
      <span className="inline-flex items-center gap-1 rounded-full bg-background-accent px-2.5 py-1.5 text-accent-success">
        {progress.xp} XP
      </span>
    </div>
  )
}
