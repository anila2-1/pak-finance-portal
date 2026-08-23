// src/utilities/generateStaticMetadata.ts
import type { Metadata } from 'next'

const SITE_NAME = 'HamariInfo'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hamariinfo.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og.jpg`

type GenerateStaticMetadataOptions = {
  title: string
  description?: string
  url?: string
  image?: string
}

export function generateStaticMetadata({
  title,
  description,
  url,
  image,
}: GenerateStaticMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  const fullUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : SITE_URL
  const fullDescription = description || `Discover more on ${SITE_NAME}.`
  const ogImage = image || DEFAULT_OG_IMAGE

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: fullDescription,
    alternates: { canonical: fullUrl },
    // robots: {
    //   index: true,
    //   follow: true,
    //   googleBot: {
    //     index: true,
    //     follow: true,
    //     'max-image-preview': 'large',
    //     'max-snippet': -1,
    //     'max-video-preview': -1,
    //   },
    // },
    openGraph: {
      type: 'website',
      locale: 'el_GR',
      siteName: SITE_NAME,
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
  }
}
