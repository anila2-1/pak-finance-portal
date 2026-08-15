import type { Metadata } from 'next'
import Header from '../components/HomePage/Header'
import AssistantChat from './AssistantChat'

export const metadata: Metadata = {
  title: 'Financial Assistant',
  description:
    'Ask Pakistan Finance Assistant about gold prices, currency rates, prize bonds, financial news and Pakistan financial markets.',
}

export default function AssistantPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8f76e]">
      <Header siteSettings={undefined} />

      <main className="flex-1">
        <AssistantChat />
      </main>
    </div>
  )
}
