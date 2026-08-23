import type { GlobalConfig } from 'payload'

export const TopUpdates: GlobalConfig = {
  slug: 'top-updates',
  label: 'Top Updates',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'enabled',
      label: 'Enable Top Updates Bar',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show the top updates bar on the frontend.',
      },
    },
    {
      name: 'autoUpdatesEnabled',
      label: 'Enable Automatic Finance Updates',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatically generate updates from the latest Daily Rates data.',
      },
    },
    {
      name: 'items',
      label: 'Manual Updates',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'select',
          options: [
            { label: 'BREAKING', value: 'BREAKING' },
            { label: 'UPDATED', value: 'UPDATED' },
            { label: 'TRENDING', value: 'TRENDING' },
            { label: 'RESULT', value: 'RESULT' },
            { label: 'ALERT', value: 'ALERT' },
          ],
          required: true,
        },
        {
          name: 'headline',
          label: 'Headline',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g. Gold prices increase in Pakistan',
          },
        },
        {
          name: 'link',
          label: 'Link (optional)',
          type: 'text',
          admin: {
            placeholder: '/posts/gold-prices or https://...',
          },
        },
        {
          name: 'active',
          label: 'Active',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'startDate',
          label: 'Start Date',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'endDate',
          label: 'End Date',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'priority',
          label: 'Priority',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Higher priority items appear first.',
          },
        },
      ],
    },
  ],
}

export default TopUpdates
