import { getPayloadClient } from './payload'

interface GetCategoriesOptions {
  limit?: number
  page?: number
}

export async function getCategories({ limit = 50, page = 1 }: GetCategoriesOptions = {}) {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'categories',
    limit,
    page,
    sort: 'name',
    depth: 1,
  })
}

export async function getCategoryBySlug(slug: string) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  return result.docs[0] ?? null
}
