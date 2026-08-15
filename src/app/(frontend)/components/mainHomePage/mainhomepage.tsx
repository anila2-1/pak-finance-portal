// src/app/(frontend)/components/mainHomePage/mainhomepage.tsx

import Header from '../HomePage/Header'
import RateCards from '../HomePage/RateCards'
import FeaturedNews from '../HomePage/FeaturedNews'
import CategoryBar from '../HomePage/CategoryBar'
import LatestPosts from '../HomePage/LatestPosts'
import PrizeBondWidget from '../HomePage/PrizeBondWidget'
import LatestUpdates from '../HomePage/LatestUpdates'
import SmartAIAssistant from '../HomePage/SmartFinanceChat'
import Footer from '../HomePage/Footer'

interface MainHomePageProps {
  dailyRates: any
  posts: any[]
  categories: any[]
  prizeBondDraws: any[]
  siteSettings: any
}

export default function MainHomePage({
  dailyRates,
  posts,
  categories,
  prizeBondDraws,
  siteSettings,
}: MainHomePageProps) {
  const featuredPosts = posts?.slice(0, 5) ?? []
  const latestUpdates = posts?.slice(0, 5) ?? []

  return (
    <div className="min-h-screen bg-[#f4f8f76e] text-[#172326]">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <Header siteSettings={siteSettings} />

      <main>
        {/* =====================================================
            LIVE FINANCIAL RATES
            ===================================================== */}
        <section aria-label="Live financial rates">
          <RateCards rates={dailyRates} />
        </section>

        {/* =====================================================
            FEATURED FINANCIAL NEWS
            ===================================================== */}
        {featuredPosts.length > 0 && (
          <section aria-label="Featured financial news">
            <FeaturedNews posts={featuredPosts} />
          </section>
        )}

        {/* =====================================================
            CONTENT AREA
            ===================================================== */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* =================================================
                MAIN CONTENT
                ================================================= */}
            <div className="min-w-0">
              {/* Categories */}
              {categories?.length > 0 && (
                <section aria-label="Financial categories">
                  <CategoryBar categories={categories} />
                </section>
              )}

              {/* Latest Posts */}
              <section aria-label="Latest financial posts">
                <LatestPosts posts={posts} />
              </section>
            </div>

            {/* =================================================
                SIDEBAR
                ================================================= */}
            <aside
              aria-label="Financial tools and updates"
              className="space-y-6 lg:sticky lg:top-24 lg:self-start"
            >
              {/* Prize Bond Search */}
              <PrizeBondWidget draws={prizeBondDraws} />

              {/* Latest Updates */}
              <LatestUpdates posts={latestUpdates} />
            </aside>
          </div>
        </section>

        {/* =====================================================
            SMART FINANCE ASSISTANT
            ===================================================== */}
        <section aria-label="Smart finance assistant">
          <SmartAIAssistant />
        </section>
      </main>

      {/* =======================================================
          FOOTER
          ======================================================= */}
      <Footer siteSettings={siteSettings} />
    </div>
  )
}
