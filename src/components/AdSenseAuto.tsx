'use client'

import Script from 'next/script'

type Props = {
  clientId: string
}

export default function AdSenseAuto({ clientId }: Props) {
  if (!clientId) return null

  return (
    <Script
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  )
}
