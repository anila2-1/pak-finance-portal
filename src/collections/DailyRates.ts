import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'

export const DailyRates: CollectionConfig = {
  slug: 'daily-rates',

  // ==========================================
  // ACCESS CONTROL
  // ==========================================

  access: {
    read: () => true,

    create: ({ req: { user } }) => Boolean(user),

    update: ({ req: { user } }) => Boolean(user),

    delete: ({ req: { user } }) => Boolean(user),
  },

  admin: {
    useAsTitle: 'date',

    defaultColumns: [
      'date',
      'gold.gold24k',
      'currency.usdBuying',
      'currency.aedRate',
      'currency.sarRate',
      'fuel.petrol',
      'silver.silverPerTola',
    ],

    group: 'Finance',
  },

  // ==========================================
  // CACHE REVALIDATION
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
    // ==========================================
    // DATE
    // ==========================================

    {
      name: 'date',
      label: 'Rate Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),

      admin: {
        description: 'Date and time these rates apply to.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // ==========================================
    // GOLD RATES
    // ==========================================

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
            description: '24K gold price in PKR per tola.',
          },
        },

        {
          name: 'gold22k',
          label: '22K Gold',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: '22K gold price in PKR per tola.',
          },
        },

        {
          name: 'gold21k',
          label: '21K Gold',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: '21K gold price in PKR per tola.',
          },
        },
      ],
    },

    // ==========================================
    // CURRENCY RATES
    // ==========================================

    {
      type: 'group',
      name: 'currency',
      label: 'Currency Exchange Rates',

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

        {
          name: 'aedRate',
          label: 'AED / PKR',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'PKR value for 1 UAE Dirham (AED).',
          },
        },

        {
          name: 'sarRate',
          label: 'SAR / PKR',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'PKR value for 1 Saudi Riyal (SAR).',
          },
        },
      ],
    },

    // ==========================================
    // FUEL PRICES
    // ==========================================

    {
      type: 'group',
      name: 'fuel',
      label: 'Fuel Prices',

      fields: [
        {
          name: 'petrol',
          label: 'Petrol',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'Petrol price in PKR per litre.',
          },
        },

        {
          name: 'highSpeedDiesel',
          label: 'High Speed Diesel',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'High Speed Diesel price in PKR per litre.',
          },
        },

        {
          name: 'keroseneOil',
          label: 'Kerosene Oil',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'Kerosene Oil price in PKR per litre.',
          },
        },

        {
          name: 'lightDieselOil',
          label: 'Light Diesel Oil',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'Light Diesel Oil price in PKR per litre.',
          },
        },
      ],
    },

    // ==========================================
    // SILVER RATES
    // ==========================================

    {
      type: 'group',
      name: 'silver',
      label: 'Silver Rates',

      fields: [
        {
          name: 'silverPerTola',
          label: 'Silver Per Tola',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'Silver price in PKR per tola.',
          },
        },

        {
          name: 'silverPer10g',
          label: 'Silver Per 10g',
          type: 'number',
          required: true,
          min: 0,

          admin: {
            description: 'Silver price in PKR per 10 grams.',
          },
        },
      ],
    },

    // ==========================================
    // SOURCE
    // ==========================================

    {
      name: 'source',
      label: 'Data Source',
      type: 'text',

      admin: {
        description: 'Source of these rates, for example official market source or notification.',
        placeholder: 'Example: Official Market Sources / SBP / OGRA / Sarafa Market',
      },
    },

    // ==========================================
    // LAST VERIFIED
    // ==========================================

    {
      name: 'lastVerifiedAt',
      label: 'Last Verified At',
      type: 'date',

      admin: {
        description: 'The date and time when these rates were last manually verified.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // ==========================================
    // NOTES
    // ==========================================

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
