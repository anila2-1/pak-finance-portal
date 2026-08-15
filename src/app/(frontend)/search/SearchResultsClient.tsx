'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'
interface SearchResultsClientProps {
  posts: any[]
  query: string
  totalDocs: number
  totalPages: number
  currentPage: number
  siteSettings?: any
}

export default function SearchResultsClient({
  posts,
  query,
  totalDocs,
  totalPages,
  currentPage,
  siteSettings,
}: SearchResultsClientProps) {
  const formatDate = (date?: string) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getImageUrl = (post: any) => {
    if (!post?.featuredImage) return null

    if (typeof post.featuredImage === 'string') {
      return post.featuredImage
    }

    return post.featuredImage?.url || null
  }

  const getCategoryName = (post: any) => {
    if (!post?.category) return 'Finance'

    if (typeof post.category === 'string') {
      return post.category
    }

    return post.category?.name || 'Finance'
  }

  return (
    <div className="min-h-screen bg-[#f4f8f76e] text-[#172326]">
      <Header siteSettings={siteSettings} />

      <main className="min-h-screen bg-[#f4f8f76e]">
        {/* =========================================
          SEARCH HEADER
      ========================================= */}

        <section className="border-b border-[#dce9e7] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#172326] sm:text-3xl">
                {query ? 'Search Results' : 'Search Financial News'}
              </h1>

              {query ? (
                <p className="mt-3 text-sm leading-6 text-[#647572] sm:text-base">
                  Showing results for{' '}
                  <span className="font-semibold text-[#172326]">&quot;{query}&quot;</span>
                </p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[#647572] sm:text-base">
                  Search Pakistan Finance for financial news, gold rates, currency, banking, taxes
                  and prize bonds.
                </p>
              )}
            </div>

            {/* Result count */}
            {query && (
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-[#cfe7e3] bg-[#eef8f6] px-3 py-1 text-xs font-semibold text-[#0f8f83]">
                  {totalDocs} {totalDocs === 1 ? 'article' : 'articles'} found
                </span>
              </div>
            )}
          </div>
        </section>

        {/* =========================================
          RESULTS
      ========================================= */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            /* =====================================
             EMPTY STATE
          ===================================== */
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#dce9e7] bg-white px-6 py-14 text-center shadow-sm sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef8f6] text-[#0f8f83]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#172326]">
                {query ? 'No articles found' : 'Search Pakistan Finance'}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647572]">
                {query
                  ? `We couldn't find any articles matching "${query}". Try another keyword.`
                  : 'Enter a keyword to find financial news and market updates.'}
              </p>

              {query && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#839491]">
                    Try searching for
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {['Gold', 'USD', 'Petrol', 'Prize Bonds', 'KSE-100'].map((keyword) => (
                      <Link
                        key={keyword}
                        href={`/search?q=${encodeURIComponent(keyword)}`}
                        className="rounded-full border border-[#dce9e7] bg-white px-3 py-1.5 text-xs font-medium text-[#526865] transition hover:border-[#0f8f83] hover:bg-[#eef8f6] hover:text-[#0f8f83]"
                      >
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* =====================================
                SECTION TITLE
            ===================================== */}
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                    Latest
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#172326]">Financial Articles</h2>
                </div>

                <span className="hidden text-xs text-[#839491] sm:block">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </div>

              {/* =====================================
                ARTICLE GRID
            ===================================== */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const imageUrl = getImageUrl(post)
                  const category = getCategoryName(post)

                  return (
                    <article
                      key={post.id}
                      className="group overflow-hidden rounded-2xl border border-[#dce9e7] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#b9ddd8] hover:shadow-md"
                    >
                      {/* IMAGE */}
                      {imageUrl ? (
                        <Link href={`/${post.slug}`} className="block overflow-hidden">
                          <div className="relative aspect-[16/9] w-full bg-[#eef4f3]">
                            <Image
                              src={imageUrl}
                              alt={post.featuredImage?.alt || post.title || 'Financial news'}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              unoptimized
                            />
                          </div>
                        </Link>
                      ) : (
                        <Link
                          href={`/${post.slug}`}
                          className="flex aspect-[16/9] items-center justify-center bg-[#eef8f6]"
                        >
                          <span className="text-sm font-bold text-[#0f8f83]">Pakistan Finance</span>
                        </Link>
                      )}

                      {/* CONTENT */}
                      <div className="p-5">
                        {/* META */}
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                          <span className="rounded-md bg-[#eef8f6] px-2 py-1 text-[#0f8f83]">
                            {category}
                          </span>

                          {post.publishedAt && (
                            <>
                              <span className="text-[#c1ccca]">•</span>

                              <span className="text-[#839491]">{formatDate(post.publishedAt)}</span>
                            </>
                          )}
                        </div>

                        {/* TITLE */}
                        <h2 className="text-lg font-bold leading-7 text-[#172326]">
                          <Link
                            href={`/${post.slug}`}
                            className="transition-colors hover:text-[#0f8f83]"
                          >
                            {post.title}
                          </Link>
                        </h2>

                        {/* EXCERPT */}
                        {post.excerpt && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#647572]">
                            {post.excerpt}
                          </p>
                        )}

                        {/* READ MORE */}
                        <Link
                          href={`/${post.slug}`}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0f8f83] transition-all group-hover:gap-2"
                        >
                          Read article
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* =====================================
                PAGINATION
            ===================================== */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                      className="rounded-lg border border-[#dce9e7] bg-white px-4 py-2 text-sm font-semibold text-[#526865] transition hover:border-[#0f8f83] hover:text-[#0f8f83]"
                    >
                      ← Previous
                    </Link>
                  )}

                  <span className="rounded-lg bg-[#172326] px-4 py-2 text-sm font-semibold text-white">
                    {currentPage}
                  </span>

                  {currentPage < totalPages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                      className="rounded-lg border border-[#dce9e7] bg-white px-4 py-2 text-sm font-semibold text-[#526865] transition hover:border-[#0f8f83] hover:text-[#0f8f83]"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      {/* =====================================================
              FOOTER
          ====================================================== */}

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
