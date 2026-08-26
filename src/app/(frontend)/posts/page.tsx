import type { Metadata } from 'next'

import { getPosts } from '@/lib/getPosts'
import { getCategories } from '@/lib/getCategories'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'

import PostsPageClient from './PostsPageClient'

export async function generateMetadata(): Promise<Metadata> {
  const postsResult = await getPosts({
    limit: 1,
    page: 1,
  })

  const latestPost = postsResult.docs[0]

  const title = 'Hamariinfo Latest Updates'

  const description =
    'Get Hamariinfo Latest Updates on Gold & Dollar rates, petrol prices, Prize Bonds, BISP & govt schemes, plus tech articles and daily news on HamariInfo.'

  const featuredImage =
    latestPost && typeof latestPost.featuredImage === 'object' ? latestPost.featuredImage : null

  const imageUrl = featuredImage?.url
    ? absoluteUrl(featuredImage.url)
    : absoluteUrl('/opengraph-image.jpg')

  const imageAlt = featuredImage?.alt || latestPost?.title || 'Hamariinfo Latest Updates'

  const canonical = absoluteUrl('/posts')

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,

      images: [
        {
          url: imageUrl,
          width: featuredImage?.width || 1200,
          height: featuredImage?.height || 630,
          alt: imageAlt,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

interface PostsPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
    category?: string
  }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams

  const query = params.q?.trim() || ''
  const page = Math.max(1, Number(params.page) || 1)
  const category = params.category

  const [postsResult, categoriesResult, siteSettings] = await Promise.all([
    getPosts({
      search: query,
      page,
      limit: 12,
      category,
    }),
    getCategories({
      limit: 50,
    }),
    getSiteSettings(),
  ])

  const posts = postsResult.docs
  const categories = categoriesResult.docs

  return (
    <PostsPageClient
      posts={posts}
      query={query}
      totalDocs={postsResult.totalDocs}
      totalPages={postsResult.totalPages}
      currentPage={postsResult.page || 1}
      siteSettings={siteSettings}
      categories={categories}
    />
  )
}
