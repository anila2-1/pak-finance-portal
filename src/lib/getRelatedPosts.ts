import { getPayloadClient } from './payload'

interface GetRelatedPostsOptions {
  categorySlug?: string
  excludeId?: string
  limit?: number
}

export async function getRelatedPosts({
  categorySlug,
  excludeId,
  limit = 3,
}: GetRelatedPostsOptions = {}) {
  const payload = await getPayloadClient()

  if (!categorySlug) {
    return {
      docs: [],
    }
  }

  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          'meta.category.slug': {
            equals: categorySlug,
          },
        },
        ...(excludeId
          ? [
              {
                id: {
                  not_equals: excludeId,
                },
              },
            ]
          : []),
      ],
    },
    limit,
    depth: 2,
    draft: false,
    sort: '-meta.publishing.publishedAt',
  })

  return result
}
