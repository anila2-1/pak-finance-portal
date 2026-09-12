import { google } from 'googleapis'

type GoogleNotificationType = 'URL_UPDATED' | 'URL_DELETED'

function getGoogleAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    throw new Error(
      'GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY is missing from environment variables.',
    )
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [
      'https://www.googleapis.com/auth/indexing',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ],
  })
}

/**
 * Submit URL to Google Indexing API.
 *
 * A successful response means Google accepted the API notification.
 * It does NOT mean the URL is already indexed in Google Search.
 */
export async function notifyGoogleIndexing(
  url: string,
  type: GoogleNotificationType = 'URL_UPDATED',
) {
  const auth = getGoogleAuth()

  const indexing = google.indexing({
    version: 'v3',
    auth,
  })

  const response = await indexing.urlNotifications.publish({
    requestBody: {
      url,
      type,
    },
  })

  return {
    success: true,
    url,
    type,
    response: response.data,
  }
}

/**
 * Check the current URL status through Google Search Console
 * URL Inspection API.
 */
export async function inspectGoogleUrl(url: string) {
  const siteUrl = (
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ||
    process.env.SITE_URL ||
    'https://hamariinfo.com'
  ).replace(/\/$/, '')

  const auth = getGoogleAuth()

  const searchconsole = google.searchconsole({
    version: 'v1',
    auth,
  })

  const response = await searchconsole.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl: url,
      siteUrl,
      languageCode: 'en-US',
    },
  })

  const result = response.data.inspectionResult
  const indexStatus = result?.indexStatusResult

  return {
    success: true,
    url,
    verdict: indexStatus?.verdict || null,
    coverageState: indexStatus?.coverageState || null,
    indexingState: indexStatus?.indexingState || null,
    pageFetchState: indexStatus?.pageFetchState || null,
    robotsTxtState: indexStatus?.robotsTxtState || null,
    lastCrawlTime: indexStatus?.lastCrawlTime || null,
    googleCanonical: indexStatus?.googleCanonical || null,
    userCanonical: indexStatus?.userCanonical || null,
    inspectionResultLink: result?.inspectionResultLink || null,
  }
}

/**
 * Submit URL to IndexNow.
 */
export async function notifyIndexNow(url: string) {
  const key = process.env.INDEXNOW_KEY

  if (!key) {
    throw new Error('INDEXNOW_KEY is missing from environment variables.')
  }

  const siteUrl = (process.env.SITE_URL || 'https://hamariinfo.com').replace(/\/$/, '')

  const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `${siteUrl}/${key}.txt`

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: new URL(siteUrl).hostname,
      key,
      keyLocation,
      urlList: [url],
    }),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(
      `IndexNow request failed (${response.status}): ${responseText || response.statusText}`,
    )
  }

  return {
    success: true,
    url,
    status: response.status,
    message:
      response.status === 200
        ? 'IndexNow accepted the URL submission.'
        : 'IndexNow request completed.',
  }
}
