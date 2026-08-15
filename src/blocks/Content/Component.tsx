import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type ContentBlockProps = any

import { CMSLink } from '@/components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map(
            (
              col: {
                enableLink: any
                link: any
                richText: any
                size?: keyof typeof colsSpanClasses
              },
              index: React.Key | null | undefined,
            ) => {
              const { enableLink, link, richText, size } = col
              const spanKey = (size || 'oneThird') as keyof typeof colsSpanClasses

              return (
                <div
                  className={cn(`col-span-4 lg:col-span-${colsSpanClasses[spanKey]}`, {
                    'md:col-span-2': size !== 'full',
                  })}
                  key={index}
                >
                  {richText && <RichText data={richText} enableGutter={false} />}

                  {enableLink && link && <CMSLink {...link} />}
                </div>
              )
            },
          )}
      </div>
    </div>
  )
}
