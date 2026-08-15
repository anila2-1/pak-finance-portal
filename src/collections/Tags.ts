import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },

  timestamps: true,

  fields: [
    {
      name: 'name',
      label: 'Tag Name',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,

      admin: {
        description: 'SEO-friendly URL. Example: gold-price',
      },
    },
  ],
}
