import Link from 'next/link'
import { ArrowUpRight, CalendarBlank } from '@phosphor-icons/react/dist/ssr'

interface LatestPostsProps {
  posts: any[]
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section>
      {/* SECTION HEADER */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f8f83]">Latest</p>

          {/* <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172326] sm:text-3xl">
            Latest Financial Articles
          </h2> */}
        </div>

        <Link
          href="/posts"
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0f8f83] transition-colors hover:text-[#08776d] sm:flex"
        >
          View all
          <ArrowUpRight
            size={16}
            weight="bold"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {posts?.length ? (
        /*
         * IMPORTANT:
         * Grid layout remains unchanged.
         */
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post: any, index: number) => {
            const imageUrl =
              typeof post?.featuredImage === 'object' ? post?.featuredImage?.url : null

            const imageAlt =
              typeof post?.featuredImage === 'object'
                ? post?.featuredImage?.alt || post?.title
                : post?.title

            const categoryName =
              typeof post?.category === 'object'
                ? post?.category?.title || post?.category?.name
                : null

            const authorName =
              typeof post?.author === 'object'
                ? post?.author?.firstName || post?.author?.name || post?.author?.email
                : null

            return (
              <article
                key={post?.id || post?.slug || index}
                className="group relative overflow-hidden rounded-2xl border border-[#dceae8] bg-white shadow-[0_3px_18px_rgba(23,35,38,0.035)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#b9ddd8] hover:shadow-[0_14px_35px_rgba(15,143,131,0.10)]"
              >
                {/* TOP ACCENT */}
                <div className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[#0f8f83] transition-transform duration-500 group-hover:scale-x-100" />

                {/* IMAGE */}
                <Link href={`/${post?.slug}`} className="block" aria-label={post?.title}>
                  <div className="relative aspect-video overflow-hidden bg-[#eaf5f3]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#eaf5f3]">
                        <span className="text-xs font-medium text-[#6d8582]">Financial News</span>
                      </div>
                    )}

                    {/* IMAGE OVERLAY */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#172326]/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* CATEGORY */}
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0f8f83] shadow-sm backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0f8f83]" />
                        {categoryName || 'Finance'}
                      </span>
                    </div>

                    {/* ARROW */}
                    <span className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-[#0f8f83] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={17} weight="bold" />
                    </span>
                  </div>
                </Link>

                {/* CONTENT */}
                <div className="p-5">
                  {/* META */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-[#879493]">
                    {authorName && <span className="truncate">By {authorName}</span>}

                    {authorName && post?.publishedAt && <span className="text-[#c9d4d2]">•</span>}

                    {post?.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarBlank size={11} />
                        {new Date(post.publishedAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-2.5 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-[#172326]">
                    <Link
                      href={`/${post?.slug}`}
                      className="transition-colors duration-200 group-hover:text-[#0f8f83]"
                    >
                      {post?.title}
                    </Link>
                  </h3>

                  {/* EXCERPT */}
                  {post?.excerpt && (
                    <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-[#687877]">
                      {post?.excerpt}
                    </p>
                  )}

                  {/* BOTTOM */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#edf2f1] pt-4">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#9aa8a6]"></span>

                    <Link
                      href={`/${post?.slug}`}
                      className="group/link inline-flex items-center gap-1 text-xs font-bold text-[#0f8f83] transition-colors hover:text-[#08776d]"
                    >
                      Read article
                      <ArrowUpRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#dceae8] bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-[#687877]">No articles published yet.</p>
        </div>
      )}

      {/* MOBILE VIEW ALL */}
      {posts?.length > 0 && (
        <div className="mt-5 sm:hidden">
          <Link
            href="/posts"
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfe4e1] bg-white px-4 py-3 text-sm font-semibold text-[#0f8f83] transition-all duration-300 hover:border-[#0f8f83] hover:bg-[#eaf8f5]"
          >
            View all financial news
            <ArrowUpRight
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      )}
    </section>
  )
}
