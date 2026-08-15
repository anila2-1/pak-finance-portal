import type { Where } from 'payload'
import { getPayloadClient } from './payload'

interface GetPrizeBondDrawsOptions {
  limit?: number
  page?: number
  denomination?: string
}

export async function getPrizeBondDraws({
  limit = 10,
  page = 1,
  denomination,
}: GetPrizeBondDrawsOptions = {}) {
  const payload = await getPayloadClient()

  const where: Where = denomination
    ? {
        denomination: {
          equals: denomination,
        },
      }
    : {}

  try {
    return await payload.find({
      collection: 'prize-bond-draws',
      where,
      limit,
      page,
      sort: '-drawDate',
      depth: 1,
    })
  } catch (error) {
    console.error('Failed to fetch prize bond draws:', error)

    return {
      docs: [],
      totalDocs: 0,
      limit,
      totalPages: 0,
      page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
}
