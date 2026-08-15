import { Metadata } from 'next'
import { getPosts } from '@/lib/getPosts'
import { getSiteSettings } from '@/lib/getSiteSettings'
import SearchResultsClient from './SearchResultsClient'

export const metadata: Metadata = {
  title: 'Search Financial News',
  description:
    'Search Pakistan Finance for financial news, gold rates, currency, banking, taxes and prize bonds.',
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

  const [posts, siteSettings] = await Promise.all([
    getPosts({
      search: query,
      page,
      limit: 12,
    }),
    getSiteSettings(),
  ])

  return (
    <SearchResultsClient
      posts={posts.docs}
      query={query}
      totalDocs={posts.totalDocs}
      totalPages={posts.totalPages}
      currentPage={posts.page || 1}
      siteSettings={siteSettings}
    />
  )
}
