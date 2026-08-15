// src/app/(frontend)/layout.tsx

import React from 'react'
import './styles.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/getSiteSettings'
import AdSenseAuto from '../../components/AdSenseAuto'
import GoogleAnalytics from '../../components/GoogleAnalytics'
import ScrollToTop from './components/HomePage/ScrollToTop'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSiteSettings()) ?? {}

  const siteName = (settings as any).siteName || 'Pakistan Finance'

  const description =
    (settings as any).siteDescription ||
    'Pakistan financial rates, gold prices, currency rates, prize bonds and financial market information.'

  const metaTitle = (settings as any).defaultMetaTitle || siteName

  const metaDescription = (settings as any).defaultMetaDescription || description

  const favicon = (settings as any).favicon

  const faviconUrl = typeof favicon === 'object' && favicon?.url ? favicon.url : undefined

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),

    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },

    description: metaDescription,

    alternates: {
      canonical: '/',
    },

    robots: {
      index: true,
      follow: true,
    },

    icons: faviconUrl
      ? {
          icon: faviconUrl,
        }
      : undefined,

    openGraph: {
      type: 'website',
      siteName,
      title: metaTitle,
      description: metaDescription,
      url: '/',
    },

    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const settings = (await getSiteSettings()) ?? {}

  const adsenseEnabled = Boolean((settings as any).adsenseEnabled)

  const adsenseClientId = (settings as any).adsenseClientId

  const gaEnabled = Boolean((settings as any).gaEnabled)

  const gaMeasurementId = (settings as any).gaMeasurementId

  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        {/* Google AdSense */}
        {adsenseEnabled && adsenseClientId && <AdSenseAuto clientId={adsenseClientId} />}

        {/* Google Analytics */}
        {gaEnabled && gaMeasurementId && <GoogleAnalytics measurementId={gaMeasurementId} />}
      </head>

      <body className="font-sans bg-[#f4f8f76e]">
        <main>{children}</main>
        <ScrollToTop />
      </body>
    </html>
  )
}
