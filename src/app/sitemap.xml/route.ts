export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

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

  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 10000,
      where: {
        _status: { equals: 'published' },
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 10000,
    }),
  ])

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(SITE_URL)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeXml(`${SITE_URL}/posts`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${escapeXml(`${SITE_URL}/categories`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.docs
    .map(
      (post: any) => `
  <url>
    <loc>${escapeXml(`${SITE_URL}/${post.slug}`)}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('')}
  ${categories.docs
    .map(
      (category: any) => `
  <url>
    <loc>${escapeXml(`${SITE_URL}/categories/${category.slug}`)}</loc>
    <lastmod>${new Date(category.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
    )
    .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
