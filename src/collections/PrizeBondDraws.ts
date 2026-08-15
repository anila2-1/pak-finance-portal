import type { CollectionConfig } from 'payload'

export const PrizeBondDraws: CollectionConfig = {
  slug: 'prize-bond-draws',
  admin: {
    useAsTitle: 'drawNumber',
    defaultColumns: ['drawNumber', 'denomination', 'drawDate'],
    group: 'Finance',
  },

  timestamps: true,

  fields: [
    // =========================
    // DRAW INFORMATION
    // =========================
    {
      name: 'drawNumber',
      label: 'Draw Number',
      type: 'number',
      required: true,
      min: 1,
    },

    {
      name: 'denomination',
      label: 'Prize Bond Denomination',
      type: 'select',
      required: true,

      options: [
        {
          label: 'Rs. 100',
          value: '100',
        },
        {
          label: 'Rs. 200',
          value: '200',
        },
        {
          label: 'Rs. 750',
          value: '750',
        },
        {
          label: 'Rs. 1,500',
          value: '1500',
        },
        {
          label: 'Rs. 7,500',
          value: '7500',
        },
        {
          label: 'Rs. 15,000',
          value: '15000',
        },
        {
          label: 'Rs. 25,000',
          value: '25000',
        },
        {
          label: 'Rs. 40,000',
          value: '40000',
        },
      ],
    },

    {
      name: 'drawDate',
      label: 'Draw Date',
      type: 'date',
      required: true,
    },

    {
      name: 'drawCity',
      label: 'Draw City',
      type: 'text',
    },

    // =========================
    // WINNING NUMBERS
    // =========================
    {
      name: 'winningNumbers',
      label: 'Winning Numbers',
      type: 'array',

      fields: [
        {
          name: 'prize',
          label: 'Prize',
          type: 'select',
          required: true,

          options: [
            {
              label: '1st Prize',
              value: 'first',
            },
            {
              label: '2nd Prize',
              value: 'second',
            },
            {
              label: '3rd Prize',
              value: 'third',
            },
          ],
        },

        {
          name: 'amount',
          label: 'Prize Amount',
          type: 'number',
          required: true,
          min: 0,
        },

        {
          name: 'number',
          label: 'Winning Bond Number',
          type: 'text',
          required: true,
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
        description: 'Source of the prize bond draw information.',
      },
    },

    // =========================
    // NOTES
    // =========================
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
    },
  ],
}
