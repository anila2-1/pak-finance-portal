// src/app/news-sitemap.xml/route.ts

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spoilergr.com'
const SITE_NAME = 'Loacl News Portal'

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
  const payload = await getPayloadClient()

  // Calculate date 48 hours ago
  const fortyEightHoursAgo = new Date()
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48)

  const posts = await payload.find({
    collection: 'posts',
    limit: 10000,
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
    .map(
      (post: any) => `
  <url>
    <loc>${escapeXml(`${SITE_URL}/${post.slug}`)}</loc>
    <lastmod>${new Date(post.publishedAt).toISOString()}</lastmod>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>el</news:language>
      </news:publication>
      <news:title>${escapeXml(post.title)}</news:title>
      <news:publication_date>${new Date(post.publishedAt).toISOString()}</news:publication_date>
      <news:genres>Post</news:genres>
    </news:news>
  </url>`,
    )
    .join('')}
</urlset>`

  return new Response(newsSitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
