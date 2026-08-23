'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from '@phosphor-icons/react'

export interface TopUpdateItem {
  id?: string
  label: 'BREAKING' | 'UPDATED' | 'TRENDING' | 'RESULT' | 'ALERT'
  headline: string
  link?: string
  priority: number
  source: 'cms' | 'auto'
}

interface TopUpdatesBarProps {
  updates: TopUpdateItem[]
}

const ROTATION_INTERVAL = 4000

const labelStyles: Record<
  string,
  {
    dot: string
  }
> = {
  BREAKING: {
    dot: 'bg-red-400',
  },
  UPDATED: {
    dot: 'bg-amber-300',
  },
  TRENDING: {
    dot: 'bg-purple-300',
  },
  RESULT: {
    dot: 'bg-emerald-300',
  },
  ALERT: {
    dot: 'bg-orange-300',
  },
}

export default function TopUpdatesBar({ updates }: TopUpdatesBarProps) {
  const [mounted, setMounted] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    setMounted(true)

    try {
      const stored = sessionStorage.getItem('top-updates-closed')
      if (stored === 'true') {
        setIsClosed(true)
      }
    } catch {
      // ignore sessionStorage errors
    }
  }, [])

  useEffect(() => {
    if (updates.length <= 1) return

    const timer = setInterval(() => {
      setOpacity(0)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % updates.length)
        setOpacity(1)
      }, 200)
    }, ROTATION_INTERVAL)

    return () => clearInterval(timer)
  }, [updates.length])

  function handleClose() {
    setIsClosed(true)

    try {
      sessionStorage.setItem('top-updates-closed', 'true')
    } catch {
      // ignore sessionStorage errors
    }
  }

  if (!mounted || isClosed || updates.length === 0) return null

  const currentUpdate = updates[currentIndex]
  const styles = labelStyles[currentUpdate.label] || labelStyles.UPDATED

  const isInternal = currentUpdate.link?.startsWith('/')

  const headlineElement = currentUpdate.link ? (
    isInternal ? (
      <Link href={currentUpdate.link} className="hover:underline">
        {currentUpdate.headline}
      </Link>
    ) : (
      <a
        href={currentUpdate.link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {currentUpdate.headline}
      </a>
    )
  ) : (
    <span>{currentUpdate.headline}</span>
  )

  return (
    <div className="bg-[#0f8f83]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
              {currentUpdate.label}
            </span>

            <div className="min-w-0 flex-1 text-center" style={{ opacity }}>
              <p className="truncate text-xs font-medium text-white/95 sm:text-sm">
                {headlineElement}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close updates bar"
            className="shrink-0 rounded-lg p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
