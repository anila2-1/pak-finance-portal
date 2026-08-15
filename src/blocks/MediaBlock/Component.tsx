// blocks/MediaBlock/Component.tsx

import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/lib/getMediaUrl'

export interface MediaBlockProps {
  content: {
    url: string
    alt?: string
    caption?: any
    mimeType?: string
  }
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  videoClassName?: string
}

export const MediaBlock = React.forwardRef<HTMLDivElement, MediaBlockProps>(
  ({ content, className = '', enableGutter = true, imgClassName = '', videoClassName = '' }, ref) => {
    if (!content?.url) return null

    const isVideo = content.mimeType?.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(content.url)

    const isRichText =
      typeof content.caption === 'object' && content.caption !== null && 'root' in content.caption

    return (
      <div
        ref={ref}
        className={`relative w-full flex justify-center ${enableGutter ? 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8' : ''} ${className}`}
      >
        <figure className="group w-full">
          <div
            className={`relative overflow-hidden rounded-xl bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 ${
              isVideo ? 'aspect-video w-full' : 'aspect-video'
            }`}
          >
            {isVideo ? (
              <video
                src={getMediaUrl(content.url)}
                className="w-full h-full object-contain"
                controls
                preload="metadata"
                playsInline
              >
                {content.alt && <track kind="captions" label={content.alt} />}
                Your browser does not support the video tag.
              </video>
            ) : (
              <Media
                resource={{
                  url: content.url,
                  alt: content.alt || '',
                  mimeType: content.mimeType,
                }}
                className="w-full h-full"
                imgClassName={`object-contain object-center ${imgClassName}`}
              />
            )}
          </div>
          {content.caption && (
            <figcaption className="mt-4 text-center text-sm text-gray-600 font-medium italic px-4">
              {isRichText ? (
                <RichText data={content.caption} enableGutter={false} enableProse={false} />
              ) : (
                content.caption
              )}
            </figcaption>
          )}
        </figure>
      </div>
    )
  },
)

MediaBlock.displayName = 'MediaBlock'

export default MediaBlock
