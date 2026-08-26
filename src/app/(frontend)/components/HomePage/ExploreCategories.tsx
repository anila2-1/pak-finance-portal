'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CaretDown, ArrowRight } from '@phosphor-icons/react'

interface ExploreCategoriesProps {
  categories: any[]
}

export default function ExploreCategories({ categories }: ExploreCategoriesProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      {/* EXPLORE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-[#46565a] transition-all hover:bg-[#e8f7f3] hover:text-[#087f73]"
      >
        Explore
        <CaretDown
          size={14}
          weight="bold"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-50 overflow-hidden rounded-xl border border-[#dce9e5] bg-white shadow-[0_14px_35px_rgba(23,35,38,0.12)]">
          {/* CATEGORIES */}
          <div className="p-2">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#e8f7f3]"
              >
                <span className="text-sm font-semibold text-[#46565a] group-hover:text-[#087f73]">
                  {category.name}
                </span>

                <ArrowRight
                  size={13}
                  weight="bold"
                  className="text-[#9aabaa] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#087f73] group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>

          {/* VIEW MORE */}
          <div className="border-t border-[#edf3f1] p-2">
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-black transition-all hover:bg-[#c8ece9]"
            >
              View More
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
