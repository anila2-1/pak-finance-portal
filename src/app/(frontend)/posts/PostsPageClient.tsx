import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarBlank,
  Tag,
  User,
} from '@phosphor-icons/react/dist/ssr'

import { getPosts } from '@/lib/getPosts'
import { getCategories } from '@/lib/getCategories'
import { getSiteSettings } from '@/lib/getSiteSettings'

import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'

interface PostsPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
  }>
}

interface CategoryItem {
  id: string | number
  slug: string
  name: string
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams

  const page = Math.max(1, Number(params.page) || 1)
  const category = params.category

  const [postsResult, categoriesResult, siteSettings] = await Promise.all([
    getPosts({
      limit: 12,
      page,
      category,
    }),

    getCategories({
      limit: 50,
    }),

    getSiteSettings(),
  ])

  const posts = postsResult.docs
  const categories = categoriesResult.docs as CategoryItem[]

  const activeCategory = categories.find((item) => item.slug === category)

  return (
    <div className="min-h-screen bg-[#f4f8f76e] text-[#172326]">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header siteSettings={siteSettings} />

      {/* =====================================================
          POSTS PAGE
      ====================================================== */}

      <main>
        {/* 
          YAHAN MERA PREVIOUS POSTS PAGE DESIGN
          POORA KA POORA SAME RAHEGA
        */}

        {/* PAGE HEADER */}
        <section className="border-b border-[#dceae8] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#172326] transition-colors duration-300 hover:text-[#0f8f83] sm:text-3xl">
                  Latest Financial Posts
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* POSTS */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {activeCategory && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xs text-[#7a8987]">Showing posts in</span>

              <span className="rounded-md bg-[#eaf8f5] px-2.5 py-1 text-xs font-bold text-[#0f8f83]">
                {activeCategory.name}
              </span>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-[#dceae8] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eaf8f5] text-[#0f8f83]">
                <Tag size={25} weight="duotone" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#172326]">No posts found</h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71817f]">
                {category
                  ? 'There are currently no published posts available in the selected category.'
                  : 'There are currently no published financial posts available.'}
              </p>

              <Link
                href="/posts"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f8f83] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08776d]"
              >
                View all posts
                <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => {
                const featuredImage = post?.featuredImage

                const imageUrl = typeof featuredImage === 'object' ? featuredImage?.url : null

                const imageAlt =
                  typeof featuredImage === 'object' ? featuredImage?.alt || post.title : post.title

                const categoryData = post?.category

                const categoryName =
                  typeof categoryData === 'object'
                    ? categoryData?.name || categoryData?.title
                    : null

                const authorName =
                  typeof post?.author === 'object'
                    ? post?.author?.firstName || post?.author?.name || post?.author?.email
                    : null

                return (
                  <article
                    key={post.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dceae8] bg-white shadow-[0_3px_18px_rgba(15,143,131,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b9dcd7] hover:shadow-[0_12px_32px_rgba(15,143,131,0.10)]"
                  >
                    <Link
                      href={`/${post.slug}`}
                      className="relative block aspect-[16/9] overflow-hidden bg-[#e8f1ef]"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={imageAlt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs font-semibold text-[#77908d]">
                            Financial News
                          </span>
                        </div>
                      )}

                      {categoryName && (
                        <div className="absolute left-3 top-3">
                          <span className="rounded-md border border-white/70 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0f8f83] shadow-sm">
                            {categoryName}
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-[#82908e]">
                        {authorName && (
                          <span className="inline-flex items-center gap-1">
                            <User size={12} />
                            {authorName}
                          </span>
                        )}

                        {post?.publishedAt && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarBlank size={12} />

                            {new Date(post.publishedAt).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-6 tracking-tight text-[#172326]">
                        <Link
                          href={`/${post.slug}`}
                          className="transition-colors group-hover:text-[#0f8f83]"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      {post?.excerpt && (
                        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-[#667477]">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-auto pt-5">
                        <div className="border-t border-[#edf2f1] pt-4">
                          <Link
                            href={`/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f8f83]"
                          >
                            Read article
                            <ArrowUpRight size={14} weight="bold" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* PAGINATION */}
          {postsResult.totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-2xl border border-[#dceae8] bg-white p-2 shadow-sm">
                {postsResult.hasPrevPage ? (
                  <Link
                    href={`/posts?page=${postsResult.prevPage}${
                      category ? `&category=${category}` : ''
                    }`}
                    className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-[#647477] hover:bg-[#eaf8f5] hover:text-[#0f8f83]"
                  >
                    <ArrowLeft size={15} />
                    Previous
                  </Link>
                ) : (
                  <span className="px-3 text-xs text-[#c1ccca]">Previous</span>
                )}

                <div className="flex h-10 items-center rounded-xl bg-[#eaf8f5] px-4 text-xs font-bold text-[#0f8f83]">
                  {postsResult.page} / {postsResult.totalPages}
                </div>

                {postsResult.hasNextPage ? (
                  <Link
                    href={`/posts?page=${postsResult.nextPage}${
                      category ? `&category=${category}` : ''
                    }`}
                    className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-[#647477] hover:bg-[#eaf8f5] hover:text-[#0f8f83]"
                  >
                    Next
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <span className="px-3 text-xs text-[#c1ccca]">Next</span>
                )}
              </div>
            </nav>
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
