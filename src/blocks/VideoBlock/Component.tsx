'use client'

import React from 'react'
import DOMPurify from 'dompurify'

export interface VideoEmbedBlockProps {
  embedCode: string
  className?: string
  enableGutter?: boolean
}

export const VideoEmbedBlock = React.forwardRef<HTMLDivElement, VideoEmbedBlockProps>(
  ({ embedCode, className = '', enableGutter = true }, ref) => {
    if (!embedCode) return null

    const sanitizedCode = DOMPurify.sanitize(embedCode, {
      ALLOWED_TAGS: ['iframe'],
      ALLOWED_ATTR: [
        'src',
        'width',
        'height',
        'frameborder',
        'allow',
        'allowfullscreen',
        'scrolling',
        'webkitallowfullscreen',
        'mozallowfullscreen',
      ],
    })

    return (
      <div
        ref={ref}
        className={`relative w-full ${enableGutter ? 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8' : ''} ${className}`}
      >
        <figure className="group w-full">
          <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <div
                className="w-full h-full flex justify-center items-center"
                dangerouslySetInnerHTML={{ __html: sanitizedCode }}
              />
            </div>
          </div>
        </figure>
      </div>
    )
  },
)

VideoEmbedBlock.displayName = 'VideoEmbedBlock'

export default VideoEmbedBlock
