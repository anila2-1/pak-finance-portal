import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Check secret token
  if (secret !== process.env.PAYLOAD_PUBLIC_DRAFT_SECRET || !slug) {
    return new Response('Invalid token or missing slug', { status: 401 })
  }

  // Enable Draft Mode in Next.js
  const draft = await draftMode()
  draft.enable()

  // Dynamic redirect path (change `/${slug}` if your post URL is different)
  redirect(`/${slug}`)
}
