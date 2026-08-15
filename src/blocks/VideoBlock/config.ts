import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'VideoBlock',
  labels: {
    singular: 'Video Block',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'embedCode',
      type: 'textarea',
      label: 'Video Embed Code',
      required: true,
      admin: {
        description: 'Paste complete iframe code from video hosting platform',
        rows: 6,
      },
      // validate: (value) => {
      //   if (!value) return 'Embed code is required'

      //   if (!value.includes('<iframe')) {
      //     return 'Please paste the complete iframe embed code'
      //   }

      //   const validSources = [
      //     'youtube.com',
      //     'youtu.be',
      //     'mail.ru',
      //     'dailymotion.com',
      //     'dai.ly',
      //     'facebook.com',
      //   ]
      //   const hasValidSource = validSources.some((source) => value.includes(source))

      //   if (!hasValidSource) {
      //     return 'Video source not supported. Use YouTube, Mail.ru, Dailymotion, or Facebook'
      //   }

      //   return true
      // },
    },
  ],
}
