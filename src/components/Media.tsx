// src/components/Media.tsx

import Image from 'next/image'
import React from 'react'
import { getMediaUrl } from '@/lib/getMediaUrl'

export interface MediaProps {
  resource: {
    url?: string | null
    alt?: string | null
    mimeType?: string | null
    width?: number | null
    height?: number | null
  }
  className?: string
  imgClassName?: string
  videoClassName?: string
}

const isVideo = (url?: string | null, mimeType?: string | null) => {
  if (mimeType?.startsWith('video/')) {
    return true
  }

  if (!url) {
    return false
  }

  const cleanUrl = url.split('?')[0]
  const extension = cleanUrl.split('.').pop()?.toLowerCase()

  return ['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(extension || '')
}

export const Media: React.FC<MediaProps> = ({
  resource,
  className,
  imgClassName,
  videoClassName,
}) => {
  if (!resource?.url) {
    return null
  }

  const src = getMediaUrl(resource.url)

  if (!src) {
    return null
  }

  /*
   * VIDEO
   */
  if (isVideo(src, resource.mimeType)) {
    return (
      <video
        src={src}
        className={videoClassName || className || 'h-auto w-full'}
        controls
        preload="metadata"
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  /*
   * IMAGE
   */
  const width = resource.width || 1200
  const height = resource.height || 675

  return (
    <Image
      src={src}
      alt={resource.alt || ''}
      width={width}
      height={height}
      className={imgClassName || className || 'h-auto w-full object-contain'}
      loading="lazy"
    />
  )
}

export default Media
