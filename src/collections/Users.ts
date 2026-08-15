import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    // Dropdown and Admin UI main email ki jagah firstName show karne kay liye:
    useAsTitle: 'firstName',
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Upload your profile picture',
      },
    },
  ],
}
