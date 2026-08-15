// src/lib/getMediaUrl.ts

export function getMediaUrl(url?: string | null): string {
  if (!url) return ''

  // Already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Local Payload media path
  if (url.startsWith('/')) {
    return url
  }

  return `/${url}`
}
