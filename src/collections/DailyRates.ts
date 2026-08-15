import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'

export const DailyRates: CollectionConfig = {
  slug: 'daily-rates',

  // ==========================================
  // ACCESS CONTROL (Public Read, Admin Write)
  // ==========================================
  access: {
    // Har koi rates dekh sakta hai (Frontend Readers)
    read: () => true,
    // Sirf Logged-in Admin users hi new rates add/edit/delete kar sakte hain
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  admin: {
    useAsTitle: 'date',
    // Fixed: Group fields dot-notation format me specify kar diye hain
    defaultColumns: ['date', 'gold.gold24k', 'currency.usdBuying', 'fuel.petrol'],
    group: 'Finance',
  },

  // ==========================================
  // HOOKS FOR ON-DEMAND CACHE REVALIDATION
  // ==========================================
  hooks: {
    afterChange: [
      async () => {
        try {
          revalidateTag('daily-rates', 'layout')
        } catch (err) {
          console.error('Failed to revalidate daily-rates cache on change:', err)
        }
      },
    ],
    afterDelete: [
      async () => {
        try {
          revalidateTag('daily-rates', 'layout')
        } catch (err) {
          console.error('Failed to revalidate daily-rates cache on delete:', err)
        }
      },
    ],
  },

  timestamps: true,

  fields: [
    // =========================
    // DATE & UPDATE INFORMATION
    // =========================
    {
      name: 'date',
      label: 'Rate Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        description: 'The date these rates apply to.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // =========================
    // GOLD RATES
    // =========================
    {
      type: 'group',
      name: 'gold',
      label: 'Gold Rates',
      fields: [
        {
          name: 'gold24k',
          label: '24K Gold',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price in PKR per tola.',
          },
        },
        {
          name: 'gold22k',
          label: '22K Gold',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price in PKR per tola.',
          },
        },
      ],
    },

    // =========================
    // USD / PKR
    // =========================
    {
      type: 'group',
      name: 'currency',
      label: 'USD / PKR',
      fields: [
        {
          name: 'usdBuying',
          label: 'USD Buying Rate',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'PKR value for 1 USD buying rate.',
          },
        },
        {
          name: 'usdSelling',
          label: 'USD Selling Rate',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'PKR value for 1 USD selling rate.',
          },
        },
      ],
    },

    // =========================
    // PETROL
    // =========================
    {
      type: 'group',
      name: 'fuel',
      label: 'Fuel Prices',
      fields: [
        {
          name: 'petrol',
          label: 'Petrol Price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Petrol price in PKR per litre.',
          },
        },
      ],
    },
    // DailyRates Collection config me add karein:
    {
      type: 'group',
      name: 'stock',
      label: 'Stock Market (PSX)',
      fields: [
        {
          name: 'kse100Index',
          label: 'KSE-100 Index Points',
          type: 'number',
          admin: {
            description: 'Current points (e.g. 78500)',
          },
        },
        {
          name: 'kse100Change',
          label: 'Daily Change (+/-)',
          type: 'number',
          admin: {
            description: 'Point gain/loss (e.g. +350 or -120)',
          },
        },
      ],
    },
    // =========================
    // SOURCE
    // =========================
    {
      name: 'source',
      label: 'Data Source',
      type: 'text',
      admin: {
        description: 'Where these rates came from.',
        placeholder: 'Example: SBP / Market Source / Official Notification',
      },
    },

    // =========================
    // NOTES
    // =========================
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      admin: {
        description: 'Optional notes about this rate update.',
      },
    },
  ],
}
