import Link from 'next/link'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface PaginationProps {
  pathname: string
  currentPage: number
  totalPages: number
  params?: Record<string, string | undefined>
  label?: string
}

function getPageItems(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export default function Pagination({
  pathname,
  currentPage,
  totalPages,
  params = {},
  label = 'Pagination',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const pageItems = getPageItems(safePage, totalPages)

  const getHref = (page: number) => {
    const searchParams = new URLSearchParams()

    Object.entries({ ...params, page: String(page) }).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })

    return `${pathname}?${searchParams.toString()}`
  }

  const pageLinkClass =
    'inline-flex size-10 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f8f83] focus-visible:ring-offset-2'

  return (
    <nav
      aria-label={label}
      className="mt-12 flex flex-col items-center gap-4 border-t border-[#dceae8] pt-8"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={getHref(safePage - 1)}
          aria-label="Go to previous page"
          aria-disabled={safePage === 1}
          className={`${pageLinkClass} ${
            safePage === 1
              ? 'pointer-events-none border-[#edf2f1] bg-[#f7f9f9] text-[#b5c0be]'
              : 'border-[#d8e9e6] bg-white text-[#526865] hover:-translate-y-0.5 hover:border-[#0f8f83] hover:text-[#0f8f83]'
          }`}
        >
          <ArrowLeft size={16} weight="bold" />
        </Link>

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-10 items-center justify-center text-sm font-bold text-[#91a09d]"
            >
              ...
            </span>
          ) : (
            <Link
              key={item}
              href={getHref(item)}
              aria-current={item === safePage ? 'page' : undefined}
              className={`${pageLinkClass} ${
                item === safePage
                  ? 'border-[#0f8f83] bg-[#0f8f83] text-white shadow-[0_6px_16px_rgba(15,143,131,0.2)]'
                  : 'border-[#d8e9e6] bg-white text-[#526865] hover:-translate-y-0.5 hover:border-[#0f8f83] hover:text-[#0f8f83]'
              }`}
            >
              {item}
            </Link>
          ),
        )}

        <Link
          href={getHref(safePage + 1)}
          aria-label="Go to next page"
          aria-disabled={safePage === totalPages}
          className={`${pageLinkClass} ${
            safePage === totalPages
              ? 'pointer-events-none border-[#edf2f1] bg-[#f7f9f9] text-[#b5c0be]'
              : 'border-[#d8e9e6] bg-white text-[#526865] hover:-translate-y-0.5 hover:border-[#0f8f83] hover:text-[#0f8f83]'
          }`}
        >
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <span className="text-xs font-semibold text-[#82908e]">
        Page {safePage} of {totalPages}
      </span>
    </nav>
  )
}
