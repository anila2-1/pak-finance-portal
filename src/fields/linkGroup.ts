import type { Field } from 'payload'

type LinkGroupOptions = {
  appearances?: string[]
  overrides?: Partial<Field>
}

// Minimal, flexible linkGroup field factory used by several blocks/components.
// Returns an `array` of `{ link: { appearance, label, url, newTab, type, reference } }` groups.
export const linkGroup = (opts: LinkGroupOptions = {}) => {
  const appearances = opts.appearances || ['inline', 'default', 'outline']

  const field = {
    name: 'links',
    type: 'array',
    label: 'Links',
    fields: [
      {
        name: 'link',
        type: 'group',
        label: 'Link',
        fields: [
          {
            name: 'appearance',
            type: 'select',
            options: appearances.map((a) => ({ label: a, value: a })),
            defaultValue: appearances[0],
          },
          {
            name: 'label',
            type: 'text',
          },
          {
            name: 'url',
            type: 'text',
          },
          {
            name: 'newTab',
            type: 'checkbox',
            defaultValue: false,
          },
          {
            name: 'type',
            type: 'select',
            options: [
              { label: 'Custom', value: 'custom' },
              { label: 'Reference', value: 'reference' },
            ],
            defaultValue: 'custom',
          },
          {
            name: 'reference',
            type: 'relationship',
            // project only has a `posts` collection; use that as the reference target
            relationTo: ['posts'],
            hasMany: false,
          },
        ],
      },
    ],
    ...(opts.overrides || {}),
  }

  // Cast to any to avoid strict Payload Field union mismatches in this helper.
  return field as any
}

export default linkGroup
