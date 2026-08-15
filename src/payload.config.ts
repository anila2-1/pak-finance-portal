import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { PrizeBondDraws } from './collections/PrizeBondDraws'
import { DailyRates } from './collections/DailyRates'
import SiteSettings from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,

    avatar: {
      Component: 'src/components/payload/AdminAvatar.tsx',
    },

    components: {
      actions: ['src/components/payload/ThemeToggle.tsx'],
    },

    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, DailyRates, Posts, PrizeBondDraws, Tags],
  // Globals array me add karein:
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['posts'],
      uploadsCollection: false,

      tabbedUI: true,

      generateTitle: ({ doc }) => {
        return doc?.title ? `${doc.title} ` : 'Pakistan Finance'
      },

      generateDescription: ({ doc }) => {
        return doc?.excerpt || ''
      },

      generateURL: ({ doc }) => {
        return doc?.slug ? `http://localhost:3000/${doc.slug}` : ''
      },
    }),
  ],
})
