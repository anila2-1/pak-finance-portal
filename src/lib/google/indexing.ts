import { google } from 'googleapis'

export async function notifyGoogleIndexing(url: string) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  // Do not fail during Next.js build.
  // Credentials are only required when this function is actually called.
  if (!clientEmail || !privateKey) {
    console.error('Google Indexing API credentials are missing. Skipping notification for:', url)

    return null
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    })

    const indexing = google.indexing({
      version: 'v3',
      auth,
    })

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    })

    console.log('✅ Google Indexing API notification sent:', url)
    console.log('Google response:', response.data)

    return response.data
  } catch (error) {
    console.error('❌ Google Indexing API error:', error)
    throw error
  }
}
