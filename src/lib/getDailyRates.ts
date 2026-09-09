import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'

export const getDailyRates = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()

      const result = await payload.find({
        collection: 'daily-rates',
        limit: 1,
        sort: '-date',
        depth: 0,
      })

      return result.docs[0] ?? null
    } catch (error) {
      console.error('Failed to fetch daily rates:', error)
      return null
    }
  },
  ['daily-rates-latest'],
  {
    revalidate: 300,
    tags: ['daily-rates'],
  },
)
