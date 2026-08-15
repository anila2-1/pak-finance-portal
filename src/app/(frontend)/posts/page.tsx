import type { Metadata } from 'next'

import { getPosts } from '@/lib/getPosts'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'

import PostsPage from './PostsPageClient'

export async function generateMetadata(): Promise<Metadata> {
  // Get the latest post so we can use its featured image for OG/Twitter
  const postsResult = await getPosts({
    limit: 1,
    page: 1,
  })

  const latestPost = postsResult.docs[0]

  const title = 'Latest Financial News'

  const description =
    'Read the latest financial news from Pakistan including gold rates, currency rates, banking, taxes, prize bonds and KSE-100 updates.'

  // Payload returns featuredImage as an object because getPosts() uses depth: 2
  const featuredImage =
    latestPost && typeof latestPost.featuredImage === 'object' ? latestPost.featuredImage : null

  const imageUrl = featuredImage?.url
    ? absoluteUrl(featuredImage.url)
    : absoluteUrl('/opengraph-image.jpg')

  const imageAlt =
    featuredImage?.alt || latestPost?.title || 'Latest Financial News - Pakistan Finance'

  const canonical = absoluteUrl('/posts')

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
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

export default PostsPage
