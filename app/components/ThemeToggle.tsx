'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(stored)
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const defaultTheme = isDark ? 'dark' : 'light'
      setTheme(defaultTheme)
    }
  }, [])

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(nextTheme)
  }

  if (!mounted) {
    return (
      <button
        style={{
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>🌙</span> Mode
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'light' ? 'Ubah ke Mode Gelap' : 'Ubah ke Mode Terang'}
      aria-label="Toggle Theme"
      style={{
        padding: '6px 14px',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--foreground)',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
      <span>{theme === 'light' ? 'Terang' : 'Gelap'}</span>
    </button>
  )
}
