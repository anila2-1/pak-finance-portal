export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hamariinfo.com'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Local News Portal'

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Calculate date 48 hours ago (Google News standard limit)
    const fortyEightHoursAgo = new Date()
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48)

    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      where: {
        publishedAt: {
          greater_than_equal: fortyEightHoursAgo.toISOString(),
        },
        _status: {
          equals: 'published',
        },
      },
    })

    const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${posts.docs
    .map((post: any) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : new Date().toISOString()

      return `
  <url>
    <loc>${escapeXml(`${SITE_URL}/${post.slug}`)}</loc>
    <lastmod>${pubDate}</lastmod>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`
    })
    .join('')}
</urlset>`

    return new Response(newsSitemap.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=59',
      },
    })
  } catch (error) {
    console.error('Error generating news sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
