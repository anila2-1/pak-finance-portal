import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCategoryBySlug } from '@/lib/getCategories'
import { getPosts } from '@/lib/getPosts'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'

import CategoryPostsClient from './CategoryPostsClient'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${category.name} `

  const description = `Latest ${category.name} news, updates, rates and financial information from Pakistan.`

  const canonical = absoluteUrl(`/categories/${category.slug}`)

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
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const [postsResult, siteSettings] = await Promise.all([
    getPosts({
      limit: 12,
      page: 1,
      category: category.slug,
    }),
    getSiteSettings(),
  ])

  return (
    <CategoryPostsClient category={category} posts={postsResult.docs} siteSettings={siteSettings} />
  )
}
