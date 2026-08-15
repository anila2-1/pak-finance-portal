import { getPayloadClient } from '@/lib/payload'

export async function getSiteSettings() {
  try {
    const payload = await getPayloadClient()

    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 2,
    })

    return settings
  } catch (error) {
    console.error('Failed to load site settings:', error)

    return null
  }
}
