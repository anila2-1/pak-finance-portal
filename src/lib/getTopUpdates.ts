import { getPayloadClient } from './payload'
import { getDailyRates } from './getDailyRates'

export interface TopUpdateItem {
  id?: string
  label: 'BREAKING' | 'UPDATED' | 'TRENDING' | 'RESULT' | 'ALERT'
  headline: string
  link?: string
  priority: number
  source: 'cms' | 'auto'
}

function isWithinDateRange(item: { startDate?: string | null; endDate?: string | null }): boolean {
  const now = new Date()
  const start = item.startDate ? new Date(`${item.startDate}T00:00:01`) : null
  const end = item.endDate ? new Date(`${item.endDate}T23:59:59.999`) : null

  if (start && now < start) return false
  if (end && now > end) return false

  return true
}

function normalizeLabel(value: string): TopUpdateItem['label'] {
  const upper = value.toUpperCase()
  if (
    upper === 'BREAKING' ||
    upper === 'UPDATED' ||
    upper === 'TRENDING' ||
    upper === 'RESULT' ||
    upper === 'ALERT'
  ) {
    return upper
  }
  return 'UPDATED'
}

export async function getTopUpdates(): Promise<TopUpdateItem[]> {
  try {
    const payload = await getPayloadClient()

    const global = await payload.findGlobal({
      slug: 'top-updates',
      depth: 0,
    })

    const enabled = Boolean((global as any)?.enabled)
    if (!enabled) return []

    const cmsItems = (global as any)?.items || []
    const autoUpdatesEnabled = Boolean((global as any)?.autoUpdatesEnabled)

    const updates: TopUpdateItem[] = []

    for (const item of cmsItems) {
      if (!item.active) continue
      if (!isWithinDateRange(item)) continue

      updates.push({
        id: item.id,
        label: normalizeLabel(item.label),
        headline: item.headline,
        link: item.link || undefined,
        priority: Number(item.priority) || 0,
        source: 'cms',
      })
    }

    if (autoUpdatesEnabled) {
      try {
        const autoUpdates = await generateAutoUpdates()
        updates.push(...autoUpdates)
      } catch (error) {
        console.error('Failed to generate auto top updates:', error)
      }
    }

    updates.sort((a, b) => b.priority - a.priority)

    return updates
  } catch (error) {
    console.error('Failed to fetch top updates:', error)
    return []
  }
}

async function generateAutoUpdates(): Promise<TopUpdateItem[]> {
  const rates = await getDailyRates()

  if (!rates) return []

  const updates: TopUpdateItem[] = []

  if (typeof rates.gold?.gold24k === 'number' && rates.gold.gold24k > 0) {
    updates.push({
      label: 'UPDATED',
      headline: `Gold price updated: 24K gold is Rs. ${rates.gold.gold24k.toLocaleString('en-PK')} per tola`,
      link: '/categories/gold',
      priority: 5,
      source: 'auto',
    })
  }

  if (typeof rates.currency?.usdBuying === 'number' && rates.currency.usdBuying > 0) {
    updates.push({
      label: 'UPDATED',
      headline: `USD/PKR rate updated to Rs. ${rates.currency.usdBuying.toLocaleString('en-PK')}`,
      link: '/categories/currency',
      priority: 4,
      source: 'auto',
    })
  }

  if (typeof rates.fuel?.petrol === 'number' && rates.fuel.petrol > 0) {
    updates.push({
      label: 'UPDATED',
      headline: `Petrol price updated to Rs. ${rates.fuel.petrol.toLocaleString('en-PK')} per litre`,
      link: '/categories/petrol',
      priority: 3,
      source: 'auto',
    })
  }

  return updates
}
