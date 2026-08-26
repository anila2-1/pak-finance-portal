import type { Metadata } from 'next'

import { getPostBySlug, getPosts } from '@/lib/getPosts'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getCategories } from '@/lib/getCategories'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'
import SinglePostClient from './SinglePostClient'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested article could not be found.',
      // robots: {
      //   index: false,
      //   follow: false,
      // },
    }
  }

  const title = post.title

  const description = post.excerpt || `Read the Hamari Latest Updates ${post.title}.`

  const featuredImage = typeof post.featuredImage === 'object' ? post.featuredImage?.url : null

  const image = featuredImage ? absoluteUrl(featuredImage) : absoluteUrl('/opengraph-image.jpg')

  const canonical = absoluteUrl(`/${post.slug}`)

  const author =
    typeof post.author === 'object' ? post.author?.firstName || post.author?.email : undefined

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],

      publishedTime: post.publishedAt || undefined,
      authors: author ? [author] : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  // Get current post
  const post = await getPostBySlug(slug)

  // Post not found
  if (!post) {
    const [siteSettings, categoriesResult] = await Promise.all([
      getSiteSettings(),
      getCategories({ limit: 50 }),
    ])

    return (
      <SinglePostClient
        post={null}
        relatedPosts={[]}
        siteSettings={siteSettings}
        categories={categoriesResult.docs}
      />
    )
  }

  /*
   * ---------------------------------------------------------
   * RELATED POSTS
   * ---------------------------------------------------------
   * Fetch posts from the same category.
   */

  const category = typeof post.category === 'object' ? post.category : null

  let relatedPosts: any[] = []

  if (category?.slug) {
    const relatedResult = await getPosts({
      category: category.slug,
      limit: 5,
      page: 1,
    })

    // Remove current post
    relatedPosts = relatedResult.docs
      .filter((relatedPost: any) => relatedPost.slug !== post.slug)
      .slice(0, 4)
  }

  const [siteSettings, categoriesResult] = await Promise.all([
    getSiteSettings(),
    getCategories({ limit: 50 }),
  ])

  return (
    <SinglePostClient
      post={post}
      relatedPosts={relatedPosts}
      siteSettings={siteSettings}
      categories={categoriesResult.docs}
    />
  )
}
