import { getCategories } from '@/lib/getCategories'
import { getDailyRates } from '@/lib/getDailyRates'
import { getPosts } from '@/lib/getPosts'
import { getPrizeBondDraws } from '@/lib/getPrizeBondDraws'
import { getSiteSettings } from '@/lib/getSiteSettings'

import MainHomePage from './components/mainHomePage/mainhomepage'

export default async function HomePage() {
  const [dailyRates, posts, categories, prizeBondDraws, siteSettings] = await Promise.all([
    getDailyRates(),
    getPosts({ limit: 12 }),
    getCategories({ limit: 10 }),
    getPrizeBondDraws({ limit: 5 }),
    getSiteSettings(),
  ])

  return (
    <MainHomePage
      dailyRates={dailyRates}
      posts={posts?.docs ?? []}
      categories={categories?.docs ?? []}
      prizeBondDraws={prizeBondDraws?.docs ?? []}
      siteSettings={siteSettings}
    />
  )
}
