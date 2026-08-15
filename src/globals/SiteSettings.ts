import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',

  admin: {
    group: 'Settings',
  },

  fields: [
    // -----------------------------------------
    // BASIC SITE INFORMATION
    // -----------------------------------------
    {
      name: 'siteName',
      label: 'Site Name',
      type: 'text',
      required: true,
      defaultValue: 'Pakistan Finance',
    },

    {
      name: 'siteDescription',
      label: 'Site Description',
      type: 'textarea',
    },

    // -----------------------------------------
    // LOGO
    // -----------------------------------------
    {
      name: 'logo',
      label: 'Website Logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload the main website logo.',
      },
    },

    // -----------------------------------------
    // FAVICON
    // -----------------------------------------
    {
      name: 'favicon',
      label: 'Favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload the website favicon.',
      },
    },

    // -----------------------------------------
    // SOCIAL MEDIA
    // -----------------------------------------
    {
      type: 'group',
      name: 'socialMedia',
      label: 'Social Media',
      fields: [
        {
          name: 'whatsapp',
          label: 'WhatsApp Channel URL',
          type: 'text',
          admin: {
            placeholder: 'https://whatsapp.com/channel/...',
          },
        },

        {
          name: 'telegram',
          label: 'Telegram Channel URL',
          type: 'text',
          admin: {
            placeholder: 'https://t.me/...',
          },
        },

        {
          name: 'facebook',
          label: 'Facebook URL',
          type: 'text',
          admin: {
            placeholder: 'https://facebook.com/...',
          },
        },

        {
          name: 'instagram',
          label: 'Instagram URL',
          type: 'text',
          admin: {
            placeholder: 'https://instagram.com/...',
          },
        },

        {
          name: 'youtube',
          label: 'YouTube URL',
          type: 'text',
          admin: {
            placeholder: 'https://youtube.com/...',
          },
        },
      ],
    },

    // // -----------------------------------------
    // // FOOTER
    // // -----------------------------------------
    // {
    //   name: 'footerText',
    //   label: 'Footer Text',
    //   type: 'textarea',
    // },

    // // -----------------------------------------
    // // SEO
    // // -----------------------------------------
    // {
    //   name: 'defaultMetaTitle',
    //   label: 'Default Meta Title',
    //   type: 'text',
    // },

    // {
    //   name: 'defaultMetaDescription',
    //   label: 'Default Meta Description',
    //   type: 'textarea',
    // },

    // -----------------------------------------
    // GOOGLE ADSENSE
    // -----------------------------------------
    {
      type: 'group',
      name: 'adsense',
      label: 'Google AdSense',
      fields: [
        {
          name: 'enabled',
          label: 'Enable AdSense',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'clientId',
          label: 'AdSense Client ID',
          type: 'text',
          admin: {
            placeholder: 'ca-pub-XXXXXXXXXXXXXXXX',
          },
        },
      ],
    },

    // -----------------------------------------
    // GOOGLE ANALYTICS
    // -----------------------------------------
    {
      type: 'group',
      name: 'analytics',
      label: 'Google Analytics',
      fields: [
        {
          name: 'enabled',
          label: 'Enable Google Analytics',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'measurementId',
          label: 'GA4 Measurement ID',
          type: 'text',
          admin: {
            placeholder: 'G-XXXXXXXXXX',
          },
        },
      ],
    },
  ],
}

export default SiteSettings
