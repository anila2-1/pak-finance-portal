//src/lib/payload.ts
import config from '@/payload.config'
import { getPayload } from 'payload'

let payloadPromise: ReturnType<typeof getPayload> | null = null

export const getPayloadClient = async () => {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config })
  }

  return payloadPromise
}
export { getPayload }
