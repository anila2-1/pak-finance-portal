'use client'

import Script from 'next/script'

type Props = {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: Props) {
  if (!measurementId) return null

  return (
    <>
      {/* Load gtag */}
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      {/* Init GA */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
