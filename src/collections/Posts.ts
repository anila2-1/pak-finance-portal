import type { CollectionConfig } from 'payload'
import { notifyGoogleIndexing } from './../lib/google/indexing'

import {
  lexicalEditor,
  HeadingFeature,
  AlignFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  LinkFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  UploadFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'
import { VideoBlock } from '@/blocks/VideoBlock/config'

export const Posts: CollectionConfig = {
  slug: 'posts',

  access: {
    read: () => true,
  },

  admin: {
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
    useAsTitle: 'title',
    preview: (doc: any) => {
      const secret = process.env.PAYLOAD_DRAFT_SECRET || ''
      const slug = doc?.slug

      if (slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://hamariinfo.com'}/api/draft-preview?slug=${slug}&secret=${secret}`
      }
      return null
    },
  },

  timestamps: true,

  versions: {
    drafts: true,
    maxPerDoc: 20,
  },

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, operation }) => {
        // Only notify Google when a post is published
        if (
          (operation === 'create' || operation === 'update') &&
          doc._status === 'published' &&
          typeof doc.slug === 'string' &&
          doc.slug.trim() !== ''
        ) {
          const siteUrl = process.env.SITE_URL || 'https://hamariinfo.com'

          const url = `${siteUrl}/${doc.slug}`

          try {
            const submission = await notifyGoogleIndexing(url, 'URL_UPDATED')

            console.log(`✅ Google accepted indexing notification: ${url}`, submission)
          } catch (error) {
            console.error(`❌ Failed to notify Google about ${url}:`, error)
          }
        }
      },
    ],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        // ========================================
        // TAB 1: MAIN CONTENT AREA
        // ========================================
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              label: 'Article Title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              label: 'URL Slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                description: 'SEO-friendly URL. Example: todays-gold-rate-in-pakistan',
              },
            },
            {
              name: 'excerpt',
              label: 'Excerpt',
              type: 'textarea',
              admin: {
                description: 'Short summary used for article previews and SEO.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                  SubscriptFeature(),
                  SuperscriptFeature(),
                  InlineCodeFeature(),
                  HeadingFeature({
                    enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                  }),
                  AlignFeature(),

                  UnorderedListFeature(),
                  OrderedListFeature(),
                  ChecklistFeature(),
                  BlockquoteFeature(),
                  HorizontalRuleFeature(),
                  LinkFeature({
                    enabledCollections: ['posts'],
                  }),
                  UploadFeature({
                    collections: {
                      media: {
                        fields: [
                          {
                            name: 'caption',
                            type: 'text',
                          },
                        ],
                      },
                    },
                  }),
                  EXPERIMENTAL_TableFeature(),

                  BlocksFeature({
                    blocks: [
                      VideoBlock,
                      {
                        slug: 'highlightBox',
                        labels: {
                          singular: 'Highlight Box',
                          plural: 'Highlight Boxes',
                        },
                        fields: [
                          {
                            name: 'style',
                            type: 'select',
                            defaultValue: 'yellow',
                            options: [
                              { label: 'Yellow Highlight', value: 'yellow' },
                              { label: 'Green Info', value: 'green' },
                              { label: 'Red Alert', value: 'red' },
                              { label: 'Blue Note', value: 'blue' },
                            ],
                          },
                          {
                            name: 'text',
                            type: 'textarea',
                            required: true,
                          },
                        ],
                      },
                      {
                        slug: 'customCode',
                        labels: {
                          singular: 'Custom Code',
                          plural: 'Custom Codes',
                        },
                        fields: [
                          {
                            name: 'code',
                            type: 'textarea',
                            required: true,
                          },
                        ],
                      },
                    ],
                  }),
                ],
              }),
            },
          ],
        },
      ],
    },

    // ========================================
    // SIDEBAR FIELDS (RIGHT SIDE PANEL)
    // ========================================

    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      label: 'Published At',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Date and time when published.',
      },
    },
    {
      name: 'author',
      label: 'Author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Select author.',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Select article category.',
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Select article category.',
      },
    },
  ],
}
