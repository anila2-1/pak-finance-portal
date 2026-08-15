import React from 'react'

type CTABlockProps = {
  links?: { link?: { appearance?: string; [key: string]: any } }[]
  richText?: any
}

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link' // Update this path if the Link component is located elsewhere, e.g. './Link' or '../components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div
        className="bg-white rounded p-4 flex flex-col gap-8 
      md:flex-row md:justify-center md:items-center"
      >
        <div className="max-w-3xl flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            const { appearance, ...rest } = link || {}

            const allowedAppearances = [
              'link',
              'default',
              'inline',
              'destructive',
              'ghost',
              'outline',
              'secondary',
            ] as const
            type AllowedAppearance = (typeof allowedAppearances)[number]

            const appearanceValue =
              typeof appearance === 'string' &&
              (allowedAppearances as readonly string[]).includes(appearance)
                ? (appearance as AllowedAppearance)
                : undefined

            return <CMSLink key={i} size="lg" appearance={appearanceValue} {...rest} />
          })}
        </div>
      </div>
    </div>
  )
}
