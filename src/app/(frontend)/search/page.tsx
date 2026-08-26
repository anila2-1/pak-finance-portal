import { Metadata } from 'next'
import { getPosts } from '@/lib/getPosts'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getCategories } from '@/lib/getCategories'
import SearchResultsClient from './SearchResultsClient'

export const metadata: Metadata = {
  title: 'Search HamariInfo News',
  description:
    'Search Pakistan HamariInfo for financial news, gold rates, currency, banking, taxes and prize bonds.',
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const query = params.q?.trim() || ''
  const page = Number(params.page) || 1

  const [posts, siteSettings, categoriesResult] = await Promise.all([
    getPosts({
      search: query,
      page,
      limit: 12,
    }),
    getSiteSettings(),
    getCategories({ limit: 50 }),
  ])

  const categories = categoriesResult.docs

  return (
    <SearchResultsClient
      posts={posts.docs}
      query={query}
      totalDocs={posts.totalDocs}
      totalPages={posts.totalPages}
      currentPage={posts.page || 1}
      siteSettings={siteSettings}
      categories={categories}
    />
  )
}
