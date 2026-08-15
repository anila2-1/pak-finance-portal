'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarBlank,
  FolderOpen,
  User,
} from '@phosphor-icons/react/dist/ssr'

import Header from './../../components/HomePage/Header'
import Footer from './../../components/HomePage/Footer'

interface CategoryPostsClientProps {
  category: any
  posts: any[]
  siteSettings?: any
}

export default function CategoryPostsClient({
  category,
  posts,
  siteSettings,
}: CategoryPostsClientProps) {
  return (
    <>
      <Header siteSettings={siteSettings} />

      <main className="min-h-screen bg-[#f4f8f76e]">
        {/* =====================================================
            CATEGORY HERO
        ===================================================== */}
        <header className="border-b border-[#dce9e7] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="relative flex flex-col items-center">
              {/* Back Link - Positioned Left */}
              <div className="w-full text-left sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:w-auto mb-4 sm:mb-0">
                <Link
                  href="/categories"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#667477] transition-colors duration-200 hover:text-[#0f8f83]"
                >
                  <ArrowLeft
                    size={16}
                    weight="bold"
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  />
                  All Categories
                </Link>
              </div>

              {/* Title - Centered */}
              <div className="max-w-2xl text-center">
                <h1 className="text-xl font-bold tracking-tight text-[#172326] transition-colors duration-300 hover:text-[#0f8f83] sm:text-2xl lg:text-3xl">
                  {category.name}
                </h1>
              </div>
            </div>
          </div>
        </header>
        {/* =====================================================
            POSTS SECTION
        ===================================================== */}
        <section aria-label={`${category.name} articles`}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {/* Section Heading */}
            <div className="mb-7 flex items-end justify-between gap-4">
              {/* <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                  Latest Articles
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172326] sm:text-3xl">
                  {category.name} News
                </h2>
              </div> */}

              {posts.length > 0 && (
                <span className="hidden rounded-full border border-[#d6e8e5] bg-white px-3 py-1.5 text-xs font-semibold text-[#647477] sm:block">
                  {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
                </span>
              )}
            </div>

            {/* Empty State */}
            {posts.length === 0 ? (
              <div className="rounded-3xl border border-[#dce9e7] bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eef8f6] text-[#0f8f83]">
                  <FolderOpen size={27} weight="duotone" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#172326]">No articles found</h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#748083]">
                  There are no published articles in the {category.name} category yet.
                </p>

                <Link
                  href="/categories"
                  className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-[#172326] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0f8f83]"
                >
                  Browse Categories
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            ) : (
              /* =================================================
                 POSTS GRID
              ================================================= */
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any) => {
                  const featuredImage =
                    typeof post.featuredImage === 'object' ? post.featuredImage : null

                  const author = typeof post.author === 'object' ? post.author : null

                  const authorName = author?.firstName || author?.name || author?.email || null

                  return (
                    <article
                      key={post.id}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d8e9e6] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9ed1c9] hover:shadow-[0_16px_35px_rgba(15,143,131,0.11)]"
                    >
                      {/* Image */}
                      {featuredImage?.url ? (
                        <Link
                          href={`/posts/${post.slug}`}
                          className="relative block overflow-hidden"
                        >
                          <div className="aspect-[16/9] overflow-hidden bg-[#eef3f2]">
                            <Image
                              src={featuredImage.url}
                              alt={featuredImage.alt || post.title}
                              width={800}
                              height={450}
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          </div>

                          {/* Image Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          {/* Category Badge */}
                          <span className="absolute left-4 top-4 rounded-lg border border-white/70 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0f8f83] shadow-sm backdrop-blur-sm">
                            {category.name}
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href={`/posts/${post.slug}`}
                          className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef8f6] to-[#f8faf9]"
                        >
                          <FolderOpen size={42} weight="duotone" className="text-[#b3dcd6]" />

                          <span className="absolute left-4 top-4 rounded-lg border border-[#cfe5e1] bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0f8f83]">
                            {category.name}
                          </span>
                        </Link>
                      )}

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        {/* Category */}
                        <Link
                          href={`/categories/${category.slug}`}
                          className="mb-2 inline-flex w-fit text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f8f83] transition-colors hover:text-[#0b756c]"
                        >
                          {category.name}
                        </Link>

                        {/* Title */}
                        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#172326] transition-colors duration-300 group-hover:text-[#0f8f83]">
                          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667477]">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="mt-auto pt-5">
                          <div className="border-t border-[#edf2f1] pt-4">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#899496]">
                              {authorName && (
                                <span className="inline-flex items-center gap-1.5">
                                  <User size={13} />
                                  {authorName}
                                </span>
                              )}

                              {post.publishedAt && (
                                <time
                                  dateTime={post.publishedAt}
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <CalendarBlank size={13} />

                                  {new Date(post.publishedAt).toLocaleDateString('en-PK', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </time>
                              )}
                            </div>

                            {/* Read Article */}
                            <Link
                              href={`/posts/${post.slug}`}
                              className="group/read mt-4 flex items-center justify-between text-xs font-bold text-[#526163] transition-colors hover:text-[#0f8f83]"
                            >
                              <span>Read article</span>

                              <span className="flex size-8 items-center justify-center rounded-full border border-[#dce9e7] text-[#7d8c8e] transition-all duration-300 group-hover/read:border-[#0f8f83] group-hover/read:bg-[#0f8f83] group-hover/read:text-white">
                                <ArrowUpRight
                                  size={15}
                                  weight="bold"
                                  className="transition-transform duration-300 group-hover/read:-translate-y-0.5 group-hover/read:translate-x-0.5"
                                />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {/* =================================================
                BACK TO CATEGORIES
            =================================================
            <div className="mt-10 border-t border-[#dce9e7] pt-7">
              <Link
                href="/categories"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#667477] transition-colors duration-200 hover:text-[#0f8f83]"
              >
                <ArrowLeft
                  size={16}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
                Browse all categories
              </Link>
            </div> */}
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />
    </>
  )
}
