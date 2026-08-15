import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarBlank,
  MapPin,
  Medal,
  Ticket,
  Trophy,
} from '@phosphor-icons/react/dist/ssr'

import { getPrizeBondDraws } from '@/lib/getPrizeBondDraws'
import { getSiteSettings } from '@/lib/getSiteSettings'
import Header from './../components/HomePage/Header'
import Footer from './../components/HomePage/Footer'

interface PrizeBondsPageProps {
  searchParams: Promise<{
    denomination?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Prize Bond Results & Draws',
  description:
    'Check Pakistan prize bond draw results, winning numbers, draw dates and prize bond information for all denominations.',

  alternates: {
    canonical: '/prize-bonds',
  },

  openGraph: {
    title: 'Prize Bond Results & Draws',
    description: 'Check Pakistan prize bond draw results, winning numbers and draw dates.',
    url: '/prize-bonds',
    type: 'website',
  },
}

const denominations = [
  { label: 'All Bonds', value: '' },
  { label: 'Rs. 100', value: '100' },
  { label: 'Rs. 200', value: '200' },
  { label: 'Rs. 750', value: '750' },
  { label: 'Rs. 1,500', value: '1500' },
  { label: 'Rs. 7,500', value: '7500' },
  { label: 'Rs. 15,000', value: '15000' },
  { label: 'Rs. 25,000', value: '25000' },
  { label: 'Rs. 40,000', value: '40000' },
]

export default async function PrizeBondsPage({ searchParams }: PrizeBondsPageProps) {
  const params = await searchParams

  const denomination = params.denomination
  const page = Math.max(1, Number(params.page) || 1)

  const [result, siteSettings] = await Promise.all([
    getPrizeBondDraws({
      limit: 10,
      page,
      denomination,
    }),
    getSiteSettings(),
  ])

  const draws = result.docs

  return (
    <>
      <Header siteSettings={siteSettings} />

      <main className="min-h-screen bg-[#f4f8f76e]">
        {/* =====================================================
            HERO
        ====================================================== */}
        <header className="border-b border-[#dce9e7] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#172326] transition-colors duration-300 hover:text-[#0f8f83] sm:text-3xl">
                Prize Bond Draws{' '}
              </h1>
            </div>
          </div>
        </header>

        {/* =====================================================
            FILTERS
        ====================================================== */}
        <section className="border-b border-[#dce9e7] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {denominations.map((item) => {
                const isActive = item.value === '' ? !denomination : denomination === item.value

                const href = item.value ? `/prize-bonds?denomination=${item.value}` : '/prize-bonds'

                return (
                  <Link
                    key={item.value || 'all'}
                    href={href}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'border-[#0f8f83] bg-[#0f8f83] text-white shadow-[0_6px_18px_rgba(15,143,131,0.18)]'
                        : 'border-[#dce9e7] bg-white text-[#5f7072] hover:-translate-y-0.5 hover:border-[#9ed1c9] hover:bg-[#f0faf8] hover:text-[#0f8f83]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            DRAW CONTENT
        ====================================================== */}
        <section aria-label="Prize bond draws">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {draws.length === 0 ? (
              /* Empty State */
              <div className="rounded-3xl border border-[#dce9e7] bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eef8f6] text-[#0f8f83]">
                  <Ticket size={27} weight="duotone" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#172326]">No prize bond draws found</h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#748083]">
                  There are currently no draw results available for the selected denomination.
                </p>

                {denomination && (
                  <Link
                    href="/prize-bonds"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f8f83] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0b7c72] hover:shadow-[0_8px_20px_rgba(15,143,131,0.18)]"
                  >
                    View All Draws
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Section Heading */}
                <div className="mb-7 flex items-end justify-between gap-4">
                  {/* <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                      Draw Results
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172326]">
                      Latest Prize Bond Draws
                    </h2>
                  </div> */}

                  <span className="hidden rounded-full border border-[#d6e8e5] bg-white px-3 py-1.5 text-xs font-semibold text-[#647477] sm:block">
                    {draws.length} {draws.length === 1 ? 'Draw' : 'Draws'}
                  </span>
                </div>

                {/* Draw Grid */}
                <div className="grid gap-5 lg:grid-cols-2">
                  {draws.map((draw: any) => (
                    <article
                      key={draw.id}
                      className="group overflow-hidden rounded-3xl border border-[#d8e9e6] bg-white shadow-[0_5px_22px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9ed1c9] hover:shadow-[0_16px_36px_rgba(15,143,131,0.10)]"
                    >
                      {/* Card Header */}
                      <div className="border-b border-[#edf2f1] bg-gradient-to-br from-[#f7fbfa] to-white p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef8f6] text-[#0f8f83] transition-all duration-300 group-hover:bg-[#0f8f83] group-hover:text-white">
                              <Ticket size={21} weight="duotone" />
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f8f83]">
                                Prize Bond Draw
                              </p>

                              <h3 className="mt-1 text-lg font-bold text-[#172326]">
                                Draw #{draw.drawNumber}
                              </h3>
                            </div>
                          </div>

                          <span className="rounded-full border border-[#d8e9e6] bg-white px-3 py-1.5 text-xs font-bold text-[#536466]">
                            Rs. {Number(draw.denomination).toLocaleString('en-PK')}
                          </span>
                        </div>

                        {/* Draw Meta */}
                        <div className="mt-5 flex flex-wrap gap-3">
                          <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs text-[#667477] ring-1 ring-[#edf2f1]">
                            <CalendarBlank size={14} className="text-[#0f8f83]" />

                            <time dateTime={draw.drawDate}>
                              {new Date(draw.drawDate).toLocaleDateString('en-PK', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </time>
                          </div>

                          {draw.drawCity && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs text-[#667477] ring-1 ring-[#edf2f1]">
                              <MapPin size={14} className="text-[#0f8f83]" />
                              {draw.drawCity}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Winning Numbers */}
                      {Array.isArray(draw.winningNumbers) && draw.winningNumbers.length > 0 && (
                        <div className="p-5 sm:p-6">
                          <div className="mb-4 flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff8e7] text-[#b98516]">
                              <Trophy size={17} weight="duotone" />
                            </div>

                            <h4 className="text-sm font-bold text-[#172326]">Winning Numbers</h4>
                          </div>

                          <div className="space-y-3">
                            {draw.winningNumbers.map((winner: any, index: number) => {
                              const prizeLabel =
                                winner.prize === 'first'
                                  ? '1st Prize'
                                  : winner.prize === 'second'
                                    ? '2nd Prize'
                                    : '3rd Prize'

                              return (
                                <div
                                  key={index}
                                  className="group/prize rounded-2xl border border-[#e6efed] bg-[#fbfdfc] p-4 transition-all duration-200 hover:border-[#b9ddd7] hover:bg-[#f4fbf9]"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div>
                                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f8f83]">
                                        {prizeLabel}
                                      </span>

                                      <p className="mt-1.5 font-mono text-lg font-bold tracking-wide text-[#172326]">
                                        {winner.number}
                                      </p>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a9799]">
                                        Prize
                                      </p>

                                      <p className="mt-1 text-sm font-bold text-[#172326]">
                                        Rs. {Number(winner.amount).toLocaleString('en-PK')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Notes / Source */}
                      {(draw.notes || draw.source) && (
                        <div className="border-t border-[#edf2f1] bg-[#fbfdfc] px-5 py-4 sm:px-6">
                          {draw.notes && (
                            <p className="text-xs leading-5 text-[#687779]">{draw.notes}</p>
                          )}

                          {draw.source && (
                            <p className="mt-2 text-[11px] font-medium text-[#9aa5a6]">
                              Source: {draw.source}
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* =================================================
                PAGINATION
            ================================================== */}
            {result.totalPages > 1 && (
              <nav
                aria-label="Prize bond pagination"
                className="mt-10 flex items-center justify-center gap-3"
              >
                {result.hasPrevPage ? (
                  <Link
                    href={`/prize-bonds?page=${result.prevPage}${
                      denomination ? `&denomination=${denomination}` : ''
                    }`}
                    className="group inline-flex items-center gap-2 rounded-xl border border-[#d8e9e6] bg-white px-4 py-2.5 text-sm font-semibold text-[#596a6c] transition-all hover:-translate-y-0.5 hover:border-[#0f8f83] hover:text-[#0f8f83]"
                  >
                    <ArrowRight
                      size={15}
                      className="rotate-180 transition-transform group-hover:-translate-x-0.5"
                    />
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#edf2f1] bg-[#f7f9f9] px-4 py-2.5 text-sm font-semibold text-[#b1babb]">
                    Previous
                  </span>
                )}

                <span className="rounded-xl bg-[#0f8f83] px-4 py-2.5 text-sm font-bold text-white shadow-[0_5px_15px_rgba(15,143,131,0.15)]">
                  Page {result.page} of {result.totalPages}
                </span>

                {result.hasNextPage ? (
                  <Link
                    href={`/prize-bonds?page=${result.nextPage}${
                      denomination ? `&denomination=${denomination}` : ''
                    }`}
                    className="group inline-flex items-center gap-2 rounded-xl border border-[#d8e9e6] bg-white px-4 py-2.5 text-sm font-semibold text-[#596a6c] transition-all hover:-translate-y-0.5 hover:border-[#0f8f83] hover:text-[#0f8f83]"
                  >
                    Next
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#edf2f1] bg-[#f7f9f9] px-4 py-2.5 text-sm font-semibold text-[#b1babb]">
                    Next
                  </span>
                )}
              </nav>
            )}
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />
    </>
  )
}
