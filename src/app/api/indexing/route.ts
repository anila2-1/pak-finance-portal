import { NextRequest, NextResponse } from 'next/server'

import { inspectGoogleUrl, notifyGoogleIndexing, notifyIndexNow } from '@/lib/google/indexing'

type Action = 'google-update' | 'google-delete' | 'google-status' | 'indexnow'

type Result = {
  url: string
  success: boolean
  action: Action
  message?: string
  error?: string
  submission?: unknown
  inspection?: unknown
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const urls = Array.isArray(body.urls) ? body.urls : []
    const action = body.action as Action

    const cleanUrls = urls.map((url: unknown) => String(url).trim()).filter(Boolean)

    if (!cleanUrls.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide at least one URL.',
        },
        { status: 400 },
      )
    }

    const validActions: Action[] = ['google-update', 'google-delete', 'google-status', 'indexnow']

    if (!validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid indexing action.',
        },
        { status: 400 },
      )
    }

    const results: Result[] = []

    for (const url of cleanUrls) {
      try {
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
          throw new Error(`Invalid URL: ${url}`)
        }

        /**
         * GOOGLE UPDATE
         */
        if (action === 'google-update') {
          const submission = await notifyGoogleIndexing(url, 'URL_UPDATED')

          results.push({
            url,
            success: true,
            action,
            message: 'Google accepted the URL submission successfully.',
            submission,
            timestamp: new Date().toISOString(),
          })

          continue
        }

        /**
         * GOOGLE DELETE
         */
        if (action === 'google-delete') {
          const submission = await notifyGoogleIndexing(url, 'URL_DELETED')

          results.push({
            url,
            success: true,
            action,
            message: 'Google accepted the URL removal notification.',
            submission,
            timestamp: new Date().toISOString(),
          })

          continue
        }

        /**
         * GOOGLE STATUS
         */
        if (action === 'google-status') {
          const inspection = await inspectGoogleUrl(url)

          results.push({
            url,
            success: true,
            action,
            message: 'Google Search Console status retrieved successfully.',
            inspection,
            timestamp: new Date().toISOString(),
          })

          continue
        }

        /**
         * INDEXNOW
         */
        if (action === 'indexnow') {
          const submission = await notifyIndexNow(url)

          results.push({
            url,
            success: true,
            action,
            message: 'IndexNow accepted the URL submission.',
            submission,
            timestamp: new Date().toISOString(),
          })

          continue
        }
      } catch (error) {
        results.push({
          url,
          success: false,
          action,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        })
      }
    }

    const failed = results.some((result) => !result.success)

    return NextResponse.json({
      success: !failed,
      results,
    })
  } catch (error) {
    console.error('Indexing API route error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
