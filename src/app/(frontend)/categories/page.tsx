import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, FolderOpen } from '@phosphor-icons/react/dist/ssr'

import Header from './../components/HomePage/Header'
import Footer from './../components/HomePage/Footer'

import { getCategories } from '@/lib/getCategories'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Explore Categories',
  description:
    'Discover live market rates, latest govt scheme updates, loan guides, prize bond results, tech news, and daily informative blogs.',

  alternates: {
    canonical: absoluteUrl('/categories'),
  },

  // robots: {
  //   index: true,
  //   follow: true,
  // },

  openGraph: {
    type: 'website',
    title: 'Explore Categories ',
    description:
      'Discover live market rates, latest govt scheme updates, loan guides, prize bond results, tech news, and daily informative blogs.',
    url: absoluteUrl('/categories'),
    siteName: SITE_NAME,
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Explore Categories',
    description:
      'Discover live market rates, latest govt scheme updates, loan guides, prize bond results, tech news, and daily informative blogs.',
  },
}

export default async function CategoriesPage() {
  const [result, siteSettings] = await Promise.all([
    getCategories({
      limit: 50,
    }),
    getSiteSettings(),
  ])

  const categories = result.docs

  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================= */}
      <Header siteSettings={siteSettings} categories={categories || []} />

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}
      <main className="min-h-screen bg-[#f4f8f76e]">
        {/* PAGE HEADER */}
        <header className="border-b border-[#dce9e7] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#172326] transition-colors duration-300 hover:text-[#0f8f83] sm:text-3xl">
                Explore Categories
              </h1>
            </div>
          </div>
        </header>

        {/* CATEGORIES */}
        <section aria-label="Explore Categories">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {categories.length === 0 ? (
              <div className="rounded-2xl border border-[#dce9e7] bg-white px-5 py-10 text-center shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[#eef8f6] text-[#0f8f83]">
                  <FolderOpen size={20} weight="duotone" />
                </div>

                <h2 className="mt-3 text-base font-bold text-[#172326]">No categories found</h2>

                <p className="mt-1 text-xs text-[#748083]">
                  Explore Categories will appear here once they are available.
                </p>
              </div>
            ) : (
              <>
                {/* SECTION HEADING */}
                <div className="mb-4 flex items-end justify-between gap-3">
                  <span className="hidden rounded-full border border-[#d6e8e5] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#647477] sm:block">
                    {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
                  </span>
                </div>

                {/* COMPACT CATEGORY GRID */}
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {categories.map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="group relative overflow-hidden rounded-xl border border-[#d8e9e6] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9ed1c9] hover:shadow-[0_8px_20px_rgba(15,143,131,0.08)]"
                    >
                      <div className="pointer-events-none absolute -right-6 -top-6 size-16 rounded-full bg-[#eef9f7] opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef8f6] text-[#0f8f83] transition-all duration-300 group-hover:bg-[#0f8f83] group-hover:text-white">
                            <FolderOpen size={16} weight="duotone" />
                          </div>

                          <span className="text-[9px] font-bold tracking-wider text-[#a0acab] transition-colors group-hover:text-[#0f8f83]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <h3 className="mt-3 line-clamp-1 text-sm font-bold text-[#172326] transition-colors duration-300 group-hover:text-[#0f8f83]">
                          {category.name}
                        </h3>

                        <div className="mt-3 flex items-center justify-between border-t border-[#edf2f1] pt-2.5">
                          <span className="text-[11px] font-semibold text-[#748083] transition-colors group-hover:text-[#0f8f83]">
                            View articles
                          </span>

                          <span className="flex size-6 items-center justify-center rounded-full border border-[#dce9e7] text-[#7d8c8e] transition-all duration-300 group-hover:border-[#0f8f83] group-hover:bg-[#0f8f83] group-hover:text-white">
                            <ArrowUpRight
                              size={12}
                              weight="bold"
                              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer siteSettings={siteSettings} />
    </>
  )
}
