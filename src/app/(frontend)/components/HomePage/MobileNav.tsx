'use client'

import { useState } from 'react'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce9e5] bg-white text-[#172326] transition-all duration-150 hover:border-[#087f73] hover:bg-[#e8f7f3] hover:text-[#087f73] active:scale-95"
      >
        {open ? <X size={21} weight="regular" /> : <List size={21} weight="regular" />}
      </button>

      {/* Mobile Navigation */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-[#dce9e5] bg-white shadow-[0_12px_30px_rgba(23,35,38,0.08)]">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#087f73] transition-colors duration-150 hover:bg-[#e8f7f3]"
              >
                Home
              </Link>

              {/* Posts */}
              <Link
                href="/posts"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#46565a] transition-colors duration-150 hover:bg-[#e8f7f3] hover:text-[#087f73]"
              >
                Posts
              </Link>

              {/* Categories */}
              <Link
                href="/categories"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#46565a] transition-colors duration-150 hover:bg-[#e8f7f3] hover:text-[#087f73]"
              >
                Categories
              </Link>

              {/* Prize Bonds */}
              <Link
                href="/prize-bonds"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#46565a] transition-colors duration-150 hover:bg-[#e8f7f3] hover:text-[#087f73]"
              >
                Prize Bonds
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
