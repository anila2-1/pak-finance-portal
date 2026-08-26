import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getCategories } from '@/lib/getCategories'
import Header from '../components/HomePage/Header'
import AssistantChat from './AssistantChat'

export const metadata: Metadata = {
  title: 'HamariInfo Assistant',
  description:
    'Ask HamariInfo AI Assistant about gold rates, currency rates, prize bonds, financial news, taxes, banking, markets and everyday information from Pakistan.',
}

export default async function AssistantPage() {
  const [siteSettings, categoriesResult] = await Promise.all([
    getSiteSettings(),
    getCategories({ limit: 50 }),
  ])

  const categories = categoriesResult.docs

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8f76e]">
      <Header siteSettings={siteSettings} categories={categories || []} />

      <main className="flex-1">
        <AssistantChat />
      </main>
    </div>
  )
}
