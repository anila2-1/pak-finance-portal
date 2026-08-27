'use client'

import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react'

interface CategoryBarProps {
  categories: any[]
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  if (!categories?.length) {
    return null
  }

  // Duplicate categories for seamless infinite scrolling
  const items = [...categories, ...categories]

  return (
    <section className="mb-10 overflow-hidden">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#172326] sm:text-2xl">
            Explore Categories
          </h2>
        </div>

        <Link
          href="/categories"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0f8f83] transition hover:text-[#08776d] sm:flex"
        >
          View all
          <ArrowUpRight size={16} weight="bold" />
        </Link>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#ffffff] to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#f8faf9] to-transparent" />

        <div className="category-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
          {items.map((category, index) => {
            const name = category?.name || category?.title || 'Category'

            const initial = name.charAt(0).toUpperCase()

            return (
              <Link
                key={`${category?.id || category?.slug}-${index}`}
                href={`/categories/${category?.slug}`}
                className="group flex h-[58px] min-w-[205px] shrink-0 items-center gap-3 rounded-xl border border-[#d8e9e6] bg-white px-4 shadow-[0_2px_10px_rgba(23,35,38,0.025)] transition-all duration-300 hover:border-[#9ed4ce] hover:bg-[#f2fbf9] hover:shadow-[0_6px_18px_rgba(15,143,131,0.08)]"
              >
                {/* Icon */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f7f4] text-xs font-bold text-[#0f8f83] transition-colors group-hover:bg-[#0f8f83] group-hover:text-white">
                  {initial}
                </span>

                {/* Name */}
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#172326]">
                  {name}
                </span>

                {/* Arrow */}
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  className="shrink-0 text-[#8ba3a1] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f8f83]"
                />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile View All */}
      <Link
        href="/categories"
        className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#0f8f83] sm:hidden"
      >
        View all categories
        <ArrowUpRight size={15} weight="bold" />
      </Link>

      {/* Animation */}
      <style jsx>{`
        .category-marquee {
          animation: category-scroll 28s linear infinite;
        }

        @keyframes category-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 6px));
          }
        }

        @media (max-width: 640px) {
          .category-marquee {
            animation-duration: 22s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
