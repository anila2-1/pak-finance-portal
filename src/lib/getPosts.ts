import type { Where } from 'payload'
import { getPayloadClient } from './payload'

interface GetPostsOptions {
  limit?: number
  page?: number
  category?: string
  tag?: string
  search?: string
}

export async function getPosts({
  limit = 12,
  page = 1,
  category,
  tag,
  search,
}: GetPostsOptions = {}) {
  const payload = await getPayloadClient()

  const conditions: Where[] = [
    {
      _status: {
        equals: 'published',
      },
    },
  ]

  // Category
  if (category?.trim()) {
    conditions.push({
      'category.slug': {
        equals: category.trim(),
      },
    })
  }

  // Tag
  if (tag?.trim()) {
    conditions.push({
      'tags.slug': {
        equals: tag.trim(),
      },
    })
  }

  // Search
  const searchTerm = search?.trim()

  if (searchTerm) {
    conditions.push({
      or: [
        {
          title: {
            contains: searchTerm,
          },
        },
        {
          excerpt: {
            contains: searchTerm,
          },
        },
      ],
    })
  }

  return payload.find({
    collection: 'posts',
    where: {
      and: conditions,
    },
    limit,
    page,
    sort: '-publishedAt',
    depth: 2,
    draft: false,
  })
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
    limit: 1,
    depth: 2,
    draft: false,
  })

  return result.docs[0] ?? null
}
