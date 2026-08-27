// src/app/(frontend)/layout.tsx

import React from 'react'
import './styles.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/getSiteSettings'
import { getTopUpdates } from '@/lib/getTopUpdates'
import AdSenseAuto from '../../components/AdSenseAuto'
import GoogleAnalytics from '../../components/GoogleAnalytics'
import ScrollToTop from './components/HomePage/ScrollToTop'
import TopUpdatesBar from './components/HomePage/TopUpdatesBar'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSiteSettings()) ?? {}

  const siteName = (settings as any).siteName || 'HamariInfo'

  const description =
    (settings as any).siteDescription ||
    'HamariInfo brings the latest Pakistan rates, gold and currency updates, prize bond results, finance guides, government schemes, banking tips and trending information.'

  const metaTitle =
    (settings as any).defaultMetaTitle ||
    "HamariInfo | Pakistan's Latest Rates, News & Daily Updates"

  const metaDescription = (settings as any).defaultMetaDescription || description

  const favicon = (settings as any).favicon

  const faviconUrl = typeof favicon === 'object' && favicon?.url ? favicon.url : undefined

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || ''),

    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },

    description: metaDescription,

    alternates: {
      canonical: '/',
    },

    // robots: {
    //   index: true,
    //   follow: true,
    // },

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

  const [settings, topUpdates] = await Promise.all([getSiteSettings(), getTopUpdates()])

  const adsenseEnabled = Boolean((settings as any)?.adsenseEnabled)

  const adsenseClientId = (settings as any)?.adsenseClientId

  const gaEnabled = Boolean((settings as any)?.gaEnabled)

  const gaMeasurementId = (settings as any)?.gaMeasurementId

  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        {/* Google AdSense */}
        {adsenseEnabled && adsenseClientId && <AdSenseAuto clientId={adsenseClientId} />}

        {/* Google Analytics */}
        {gaEnabled && gaMeasurementId && <GoogleAnalytics measurementId={gaMeasurementId} />}
      </head>

      <body className="font-sans bg-[#f5f5f5]">
        <TopUpdatesBar updates={topUpdates} />
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}
