import type { Metadata } from 'next'
import Header from '../components/HomePage/Header'
import AssistantChat from './AssistantChat'

export const metadata: Metadata = {
  title: 'HamariInfo Assistant',
  description:
    'Ask HamariInfo AI Assistant about gold rates, currency rates, prize bonds, financial news, taxes, banking, markets and everyday information from Pakistan.',
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
