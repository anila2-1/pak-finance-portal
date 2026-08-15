'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from '@phosphor-icons/react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-24 right-6 z-55 flex h-11 w-11 items-center justify-center rounded-full border border-[#cfe5e1] bg-white text-[#0f8f83] shadow-[0_8px_30px_rgba(15,143,131,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#0f8f83] hover:text-white sm:bottom-28 sm:right-7 ${
        isVisible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'
      }`}
    >
      <ArrowUp size={20} weight="bold" />
    </button>
  )
}
