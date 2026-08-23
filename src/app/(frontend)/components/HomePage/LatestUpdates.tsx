import Link from 'next/link'
import { ArrowUpRight, Clock, Newspaper } from '@phosphor-icons/react/dist/ssr'

interface LatestUpdatesProps {
  posts: any[]
}

export default function LatestUpdates({ posts }: LatestUpdatesProps) {
  const formatDate = (date?: string) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <section className="group overflow-hidden rounded-2xl border border-[#dceae8] bg-white shadow-[0_4px_20px_rgba(23,35,38,0.04)] transition-all duration-300 hover:border-[#c3dfdb] hover:shadow-[0_12px_32px_rgba(15,143,131,0.08)]">
      {/* HEADER */}
      <div className="relative border-b border-[#e8f0ef] bg-gradient-to-br from-[#f1faf8] via-white to-white px-5 py-5">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[#0f8f83]" />

        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5f6f2] text-[#0f8f83] transition-transform duration-300 group-hover:scale-105">
            <Newspaper size={19} weight="duotone" />
          </div>

          {/* Heading */}
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#0f8f83] opacity-40" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#0f8f83]" />
              </span>

              <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                Live Updates
              </h4>
            </div>

            {/* <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[#172326]">
              Latest Updates
            </h2> */}
          </div>
        </div>
      </div>

      {/* UPDATES */}
      <div className="px-5">
        {posts?.length ? (
          <div className="divide-y divide-[#edf2f1]">
            {posts.map((post: any) => (
              <article
                key={post?.id || post?.slug}
                className="group/item py-4 first:pt-5 last:pb-5"
              >
                <Link
                  href={`/${post?.slug}`}
                  className="block rounded-xl transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    {/* TIMELINE */}
                    <div className="mt-1.5 flex shrink-0 flex-col items-center">
                      <span className="relative flex size-2.5">
                        <span className="absolute inset-0 rounded-full bg-[#0f8f83]/20 transition-transform duration-300 group-hover/item:scale-[1.8]" />

                        <span className="relative size-2.5 rounded-full bg-[#0f8f83] ring-4 ring-[#eaf8f5] transition-transform duration-300 group-hover/item:scale-110" />
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-5 text-[#273638] transition-colors duration-200 group-hover/item:text-[#0f8f83]">
                          {post?.title}
                        </h3>

                        <ArrowUpRight
                          size={16}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-[#b5c3c1] transition-all duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-[#0f8f83]"
                        />
                      </div>

                      {/* DATE */}
                      {post?.publishedAt && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#8a9997]">
                          <Clock size={12} weight="regular" />

                          <time>{formatDate(post.publishedAt)}</time>
                        </div>
                      )}

                      {/* EXCERPT */}
                      {post?.excerpt && (
                        <p className="mt-1.5 line-clamp-1 text-[11px] leading-5 text-[#899795]">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="px-2 py-10 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#f1f7f6] text-[#91a19f]">
              <Newspaper size={20} weight="duotone" />
            </div>

            <p className="mt-3 text-sm font-medium text-[#748381]">No latest updates available.</p>

            <p className="mt-1 text-xs text-[#a0acab]">New HamariInfo updates will appear here.</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {posts?.length > 0 && (
        <div className="border-t border-[#edf2f1] bg-[#fbfdfd] px-5 py-3.5">
          <Link
            href="/posts"
            className="group/footer flex items-center justify-center gap-1.5 text-xs font-bold text-[#647674] transition-colors duration-200 hover:text-[#0f8f83]"
          >
            View all updates
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-300 group-hover/footer:-translate-y-0.5 group-hover/footer:translate-x-0.5"
            />
          </Link>
        </div>
      )}
    </section>
  )
}
