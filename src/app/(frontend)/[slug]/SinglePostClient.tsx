'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, CalendarBlank, User } from '@phosphor-icons/react/dist/ssr'

import RichText from '@/components/RichText'
import Header from './../components/HomePage/Header'
import Footer from './../components/HomePage/Footer'

interface SinglePostClientProps {
  post: any
  relatedPosts: any[]
  siteSettings?: any
  categories?: any[]
}

export default function SinglePostClient({
  post,
  relatedPosts,
  siteSettings,
  categories = [],
}: SinglePostClientProps) {
  if (!post) {
    return (
      <>
        <Header siteSettings={siteSettings} categories={categories} />

        <main className="min-h-[50vh]">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#eaf7f5] text-[#0f8f83]">
              <span className="text-xl font-bold">!</span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#172326]">
              Post Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#667477]">
              The requested article could not be found or may no longer be available.
            </p>

            <Link
              href="/posts"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#172326] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#0f8f83]"
            >
              <ArrowLeft size={14} weight="bold" />
              Back to Posts
            </Link>
          </div>
        </main>

        <Footer siteSettings={{ siteName: 'HamariInfo' }} />
      </>
    )
  }

  const featuredImage = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const category = typeof post.category === 'object' ? post.category : null
  const author = typeof post.author === 'object' ? post.author : null
  const authorName = author?.firstName || author?.name || author?.email || 'HamariInfo'

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <>
      <Header siteSettings={siteSettings} categories={categories} />

      <main>
        {/* =======================================================
            COMPACT HERO ARTICLE HEADER
        ======================================================= */}
        <section className="relative overflow-hidden">
          {featuredImage?.url ? (
            <div className="relative h-90 w-full sm:h-105 lg:h-115">
              {/* Featured Image */}
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />

              {/* Hero Content */}
              <div className="relative z-10 flex h-full items-end">
                <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8">
                  <div className="max-w-3xl">
                    {/* Category */}
                    {category?.name && (
                      <Link
                        href={`/categories/${category.slug}`}
                        className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-[#0f8f83]"
                      >
                        <span className="size-1.5 rounded-full bg-[#5ac8bb]" />
                        {category.name}
                        <ArrowUpRight size={12} weight="bold" />
                      </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-xl font-bold leading-snug tracking-tight text-white drop-shadow-sm sm:text-2xl md:text-3xl">
                      {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="mt-2.5 line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/80">
                      {authorName && (
                        <div className="flex items-center gap-1.5">
                          <User size={14} weight="bold" />
                          <span>
                            By <span className="font-semibold text-white">{authorName}</span>
                          </span>
                        </div>
                      )}

                      {formattedDate && (
                        <div className="flex items-center gap-1.5">
                          <CalendarBlank size={14} weight="bold" />
                          <time dateTime={post.publishedAt}>{formattedDate}</time>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Header */
            <div className="bg-[#172326] py-12 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {category?.name && (
                    <Link
                      href={`/categories/${category.slug}`}
                      className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#0f8f83] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                    >
                      <span className="size-1.5 rounded-full bg-white" />
                      {category.name}
                    </Link>
                  )}

                  <h1 className="text-2xl font-bold text-white sm:text-3xl">{post.title}</h1>

                  {post.excerpt && (
                    <p className="mt-2 text-xs text-white/70 sm:text-sm">{post.excerpt}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/70">
                    {authorName && <span>By {authorName}</span>}
                    {formattedDate && <span>{formattedDate}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =======================================================
            ARTICLE AREA
        ======================================================= */}
        <section className="bg-[#faf7f7]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,820px)_280px] lg:items-start lg:justify-center">
              {/* Article */}
              <article className="min-w-0 overflow-hidden ">
                <div
                  className="
                    prose prose-slate max-w-none
                    prose-headings:font-bold
                    prose-headings:tracking-tight
                    prose-headings:text-[#172326]
                    prose-h2:mt-6 prose-h2:text-xl
                    prose-h3:mt-5 prose-h3:text-lg
                    prose-p:text-sm prose-p:leading-7 prose-p:text-[#4f6063]
                    prose-a:text-[#0f8f83] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-[#172326]
                    prose-blockquote:border-[#0f8f83] prose-blockquote:bg-[#f0faf8] prose-blockquote:px-4 prose-blockquote:py-2.5
                    prose-img:rounded-xl
                  "
                >
                  {post.content && <RichText data={post.content} />}
                </div>

                {/* Tags */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="mt-8 border-t border-[#e8efee] pt-5">
                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[#748083]">
                      Tags
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag: any) => {
                        const tagName = typeof tag === 'object' ? tag.name || tag.title : null
                        if (!tagName) return null

                        return (
                          <Link
                            key={tag.id}
                            href={`/posts?tag=${tag.slug}`}
                            className="rounded-full border border-[#dce9e7] bg-[#f8faf9] px-2.5 py-1 text-[11px] font-medium text-[#667477] transition-all hover:border-[#0f8f83] hover:bg-[#0f8f83] hover:text-white"
                          >
                            #{tagName}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-[#dce9e7] bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f8f83]">
                    Article Info
                  </p>

                  <h2 className="mt-1 text-base font-bold text-[#172326]">About this article</h2>

                  <div className="mt-4 space-y-2.5">
                    {category?.name && (
                      <Link
                        href={`/categories/${category.slug}`}
                        className="flex items-center justify-between rounded-lg bg-[#f5faf9] px-3 py-2 text-xs transition-colors hover:bg-[#eaf7f5]"
                      >
                        <span className="text-[#748083]">Category</span>
                        <span className="font-semibold text-[#0f8f83]">{category.name}</span>
                      </Link>
                    )}

                    {authorName && (
                      <div className="flex items-center justify-between rounded-lg bg-[#f5faf9] px-3 py-2 text-xs">
                        <span className="text-[#748083]">Author</span>
                        <span className="max-w-32.5 truncate font-semibold text-[#172326]">
                          {authorName}
                        </span>
                      </div>
                    )}

                    {formattedDate && (
                      <div className="flex items-center justify-between rounded-lg bg-[#f5faf9] px-3 py-2 text-xs">
                        <span className="text-[#748083]">Published</span>
                        <span className="font-semibold text-[#172326]">{formattedDate}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/posts"
                    className="group mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-[#172326] px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#0f8f83]"
                  >
                    <ArrowLeft
                      size={13}
                      className="transition-transform group-hover:-translate-x-0.5"
                    />
                    Back to all posts
                  </Link>
                </div>
              </aside>
            </div>

            {/* =======================================================
                RELATED POSTS
            ======================================================= */}
            {relatedPosts?.length > 0 && (
              <section className="mt-12 border-t border-[#dce9e7] pt-10">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                      Keep Reading
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172326]">
                      Related Articles
                    </h2>

                    <p className="mt-1 text-sm text-[#667477]">
                      More information updates you may find useful.
                    </p>
                  </div>

                  <Link
                    href="/posts"
                    className="hidden items-center gap-1.5 text-xs font-semibold text-[#667477] transition-colors hover:text-[#0f8f83] sm:flex"
                  >
                    View all
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedPosts.slice(0, 4).map((relatedPost: any) => {
                    const relatedImage =
                      typeof relatedPost.featuredImage === 'object'
                        ? relatedPost.featuredImage
                        : null

                    const relatedCategory =
                      typeof relatedPost.category === 'object' ? relatedPost.category : null

                    return (
                      <article
                        key={relatedPost.id}
                        className="group overflow-hidden rounded-2xl border border-[#dce9e7] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#a9d8d2] hover:shadow-[0_14px_32px_rgba(15,143,131,0.10)]"
                      >
                        {/* Image */}
                        <Link href={`/${relatedPost.slug}`} className="block overflow-hidden">
                          {relatedImage?.url ? (
                            <div className="relative aspect-[16/9] overflow-hidden bg-[#eef4f3]">
                              <Image
                                src={relatedImage.url}
                                alt={relatedImage.alt || relatedPost.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
                            </div>
                          ) : (
                            <div className="flex aspect-[16/9] items-center justify-center bg-[#eef8f6]">
                              <span className="text-xs font-semibold text-[#0f8f83]">
                                HamariInfo
                              </span>
                            </div>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                          {/* Category */}
                          {relatedCategory?.name && (
                            <Link
                              href={`/categories/${relatedCategory.slug}`}
                              className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#0f8f83] transition-colors hover:text-[#0b746b]"
                            >
                              {relatedCategory.name}
                            </Link>
                          )}

                          {/* Title */}
                          <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#172326] transition-colors duration-300 group-hover:text-[#0f8f83]">
                            <Link href={`/${relatedPost.slug}`}>{relatedPost.title}</Link>
                          </h3>

                          {/* Excerpt */}
                          {relatedPost.excerpt && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#748083]">
                              {relatedPost.excerpt}
                            </p>
                          )}

                          {/* Bottom */}
                          <div className="mt-4 flex items-center justify-between border-t border-[#edf2f1] pt-3">
                            {relatedPost.publishedAt ? (
                              <time
                                dateTime={relatedPost.publishedAt}
                                className="text-[10px] text-[#8a9698]"
                              >
                                {new Date(relatedPost.publishedAt).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </time>
                            ) : (
                              <span />
                            )}

                            <span className="flex size-7 items-center justify-center rounded-full border border-[#dce9e7] text-[#7d8c8e] transition-all duration-300 group-hover:border-[#0f8f83] group-hover:bg-[#0f8f83] group-hover:text-white">
                              <ArrowUpRight
                                size={13}
                                weight="bold"
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Mobile View All */}
                <div className="mt-5 sm:hidden">
                  <Link
                    href="/posts"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#dce9e7] bg-white px-4 py-2.5 text-xs font-semibold text-[#667477] transition-all hover:border-[#0f8f83] hover:text-[#0f8f83]"
                  >
                    View all articles
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />
    </>
  )
}
