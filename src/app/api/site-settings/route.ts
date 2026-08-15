import { getSiteSettings } from '@/lib/getSiteSettings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSiteSettings()

    return new Response(JSON.stringify({ success: true, data: settings }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Failed to load site settings:', error)

    return new Response(JSON.stringify({ success: false, error: 'Failed to load site settings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
