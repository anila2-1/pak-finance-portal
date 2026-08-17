import Link from 'next/link'
import { ArrowUpRight, CalendarBlank, User } from '@phosphor-icons/react/dist/ssr'

interface FeaturedNewsProps {
  posts: any[]
}

export default function FeaturedNews({ posts }: FeaturedNewsProps) {
  if (!posts?.length) {
    return null
  }

  const featured = posts[0]
  // Only show 3 secondary posts on the right side, with 1 main featured story on the left
  const secondary = posts.slice(1, 4)

  const featuredImageUrl =
    typeof featured?.featuredImage === 'object' ? featured?.featuredImage?.url : null

  const featuredImageAlt =
    typeof featured?.featuredImage === 'object'
      ? featured?.featuredImage?.alt || featured?.title
      : featured?.title

  const featuredAuthorName =
    typeof featured?.author === 'object'
      ? featured?.author?.firstName || featured?.author?.name || featured?.author?.email
      : null

  const featuredCategoryName =
    typeof featured?.category === 'object'
      ? featured?.category?.title || featured?.category?.name
      : null

  const formatDate = (date?: string) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <section className="border-y border-[#dcece9] bg-[#385945]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-4 flex items-end justify-between">
          <div></div>

          <Link
            href="/posts"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#ffffff] transition hover:text-[#f3fffe] sm:flex"
          >
            View all
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>

        {/* NEWS GRID */}
        <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
          {/* =====================================================
              MAIN FEATURED POST
          ===================================================== */}
          <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#385945] bg-[#d9ece8] shadow-[0_5px_25px_rgba(15,143,131,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(15,143,131,0.11)] lg:col-span-7">
            {/* IMAGE CONTAINER */}
            <Link href={`/${featured.slug}`} className="block">
              <div className="relative aspect-video w-full overflow-hidden bg-[#dfeceb]">
                {featuredImageUrl ? (
                  <img
                    src={featuredImageUrl}
                    alt={featuredImageAlt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#eaf8f5]">
                    <span className="text-sm font-medium text-[#6a8784]">Featured News</span>
                  </div>
                )}
              </div>
            </Link>

            {/* CONTENT */}
            <div className="relative flex flex-1 flex-col justify-between p-4 pb-6 sm:p-5 sm:pb-6">
              <div>
                {/* META */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-[#728083]">
                  {featuredCategoryName && (
                    <span className="rounded-md bg-[#385945] px-2.5 py-1 font-semibold text-[#ffffff]">
                      {featuredCategoryName}
                    </span>
                  )}

                  {featuredAuthorName && (
                    <span className="inline-flex items-center gap-1">
                      <User size={13} />
                      {featuredAuthorName}
                    </span>
                  )}

                  {featured?.publishedAt && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarBlank size={13} />
                      {formatDate(featured.publishedAt)}
                    </span>
                  )}
                </div>

                {/* TITLE */}
                <h3 className="mt-2.5 max-w-[92%] text-lg font-bold leading-snug tracking-tight text-[#121b1d] sm:text-xl">
                  <Link
                    href={`/${featured.slug}`}
                    className="transition-colors hover:text-[#09867a]"
                  >
                    {featured.title}
                  </Link>
                </h3>

                {/* EXCERPT */}
                {featured?.excerpt && (
                  <p className="mt-2 max-w-[92%] line-clamp-2 text-sm leading-relaxed text-[#667477]">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* TAGS */}
              {Array.isArray(featured?.tags) && featured.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#edf2f1] pt-3 pr-12">
                  {featured.tags.slice(0, 4).map((tag: any) => {
                    const tagTitle = typeof tag === 'object' ? tag?.title || tag?.name : tag

                    if (!tagTitle) return null

                    return (
                      <span
                        key={tag?.id || tagTitle}
                        className="rounded-md bg-[#385945] px-2 py-0.5 text-[10px] font-medium text-[#f1f8fa]"
                      >
                        #{tagTitle}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* CURVED CORNER ARROW */}
              <Link
                href={`/${featured.slug}`}
                aria-label={`Read ${featured.title}`}
                className="
                  absolute
                  bottom-0
                  right-0
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-tl-[30px]
                  bg-[#385945]
                  text-[#136159]
                  transition-all
                  duration-300
                  hover:bg-[#385945]
                  hover:text-white
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#385945]
                    text-white
                    shadow-sm
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <ArrowUpRight size={17} weight="bold" />
                </span>
              </Link>
            </div>
          </article>

          {/* =====================================================
              SECONDARY POSTS (NOW SHOWING 3 POSTS TO FILL SPACE)
          ===================================================== */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-5">
            {secondary.map((post: any) => {
              const categoryName =
                typeof post?.category === 'object'
                  ? post?.category?.title || post?.category?.name
                  : null

              const authorName =
                typeof post?.author === 'object'
                  ? post?.author?.firstName || post?.author?.name || post?.author?.email
                  : null

              const imageUrl =
                typeof post?.featuredImage === 'object' ? post?.featuredImage?.url : null

              const imageAlt =
                typeof post?.featuredImage === 'object'
                  ? post?.featuredImage?.alt || post?.title
                  : post?.title

              return (
                <article
                  key={post?.id}
                  className="
                    group
                    relative
                    flex
                    flex-1
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[#385945]
                    bg-[#385945]
                    p-6
                    shadow-[0_3px_16px_rgba(23,35,38,0.035)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#385945]
                    hover:shadow-[0_10px_28px_rgba(15,143,131,0.09)]
                  "
                >
                  {/* THUMBNAIL IMAGE */}
                  <Link
                    href={`/${post?.slug}`}
                    className="
                      relative
                      h-18
                      w-28
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-[#dfeceb]
                      sm:h-20
                      sm:w-32
                    "
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="
                          h-full
                          w-full
                          object-cover
                          object-center
                          transition-transform
                          duration-500
                          group-hover:scale-110
                        "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#eaf8f5]">
                        <span className="text-[11px] font-medium text-[#6a8784]">News</span>
                      </div>
                    )}
                  </Link>

                  {/* CONTENT */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center pr-8">
                    {/* CATEGORY */}
                    <div className="mb-4 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0f8f83]" />
                      <span className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#f1fffe]">
                        {categoryName || 'Finance'}
                      </span>
                    </div>
                    {/* META */}
                    <div className="mb-6 flex flex-wrap items-center gap-1.5 text-[10px] text-[#eef1f1]">
                      {authorName && <span className="truncate">By {authorName}</span>}
                      {authorName && post?.publishedAt && <span className="text-[#eceeee]">•</span>}
                      {post?.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                    </div>
                    {/* TITLE */}
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-[#e9e9e9] sm:text-sm">
                      <Link
                        href={`/${post?.slug}`}
                        className="transition-colors hover:text-[#b9ddda]"
                      >
                        {post?.title}
                      </Link>
                    </h3>
                    {/* EXCERPT */}
                    {post?.excerpt && (
                      <p className="mt-2 max-w-[92%] line-clamp-2 text-sm leading-relaxed text-[#b9ddda]">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* HOVER ARROW */}
                  <Link
                    href={`/${post?.slug}`}
                    aria-label={`Read ${post?.title}`}
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-7
                      w-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      bg-[#eaf8f5]
                      text-[#0f8f83]
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:opacity-100
                    "
                  >
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-5 sm:hidden">
          <Link
            href="/posts"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[#cfe4e1]
              bg-white
              px-4
              py-3
              text-sm
              font-semibold
              text-[#0f8f83]
              transition
              hover:bg-[#eaf8f5]
            "
          >
            View all financial news
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  )
}
