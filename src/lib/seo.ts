import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const SITE_NAME = 'Pakistan Finance'

export const DEFAULT_DESCRIPTION =
  'Pakistan Finance provides the latest gold rates, currency rates, petrol prices, KSE-100 updates, prize bond results and financial news in Pakistan.'

export function absoluteUrl(path = '') {
  return new URL(path, SITE_URL).toString()
}

interface CreateSeoOptions {
  title: string
  description?: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function createSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: CreateSeoOptions): Metadata {
  const canonical = absoluteUrl(path)

  const ogImage = image ? absoluteUrl(image) : absoluteUrl('/opengraph-image.jpg')

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],

      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}
