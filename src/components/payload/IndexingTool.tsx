'use client'

import React, { useState } from 'react'

type Action = 'google-update' | 'google-delete' | 'google-status' | 'indexnow'

type Result = {
  [x: string]: any
  url: string
  success: boolean
  action: string
  timestamp?: string
  error?: string
  submission?: unknown
  inspection?: {
    verdict?: string | null
    coverageState?: string | null
    indexingState?: string | null
    pageFetchState?: string | null
    robotsTxtState?: string | null
    lastCrawlTime?: string | null
    googleCanonical?: string | null
    userCanonical?: string | null
    inspectionResultLink?: string | null
  } | null
}

export default function IndexingTool() {
  const [urls, setUrls] = useState('')
  const [action, setAction] = useState<Action>('google-update')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [showRaw, setShowRaw] = useState(false)
  const [rawResponse, setRawResponse] = useState<unknown>(null)

  const submitToAPI = async () => {
    const parsedUrls = urls
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    if (!parsedUrls.length) {
      alert('Please enter at least one URL.')
      return
    }

    setLoading(true)
    setResults([])
    setRawResponse(null)

    try {
      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: parsedUrls,
          action,
        }),
      })

      const data = await response.json()

      setRawResponse(data)
      setResults(data.results || [])

      if (!response.ok) {
        alert(data.error || 'API request failed.')
      }
    } catch (error) {
      setResults([
        {
          url: '',
          success: false,
          action,
          error: error instanceof Error ? error.message : 'Request failed.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('en-PK', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Karachi',
    }).format(new Date(date))
  }

  const getResultMessage = (result: Result) => {
    if (result.message) {
      return result.message
    }

    if (result.action === 'google-status' && result.inspection) {
      if (result.inspection.verdict === 'PASS') {
        return 'Indexed by Google'
      }

      return (
        result.inspection.coverageState || result.inspection.verdict || 'Google status unavailable'
      )
    }

    return 'Request completed successfully.'
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: '0 24px 60px',
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Google Indexing
      </h1>

      <p
        style={{
          color: '#666',
          marginBottom: 30,
        }}
      >
        Submit URLs to Google and check their current Search Console index status.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: 'block',
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          URLs
        </label>

        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={'https://hamariinfo.com/example-post\nhttps://hamariinfo.com/another-post'}
          rows={7}
          style={{
            width: '100%',
            padding: 16,
            border: '1px solid #ccc',
            borderRadius: 8,
            fontSize: 16,
            resize: 'vertical',
          }}
        />

        <small style={{ color: '#777' }}>One URL per line. Multiple URLs are supported.</small>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: 'block',
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Action
        </label>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <label>
            <input
              type="radio"
              checked={action === 'google-update'}
              onChange={() => setAction('google-update')}
            />{' '}
            Google: Publish/update URL
          </label>

          <label>
            <input
              type="radio"
              checked={action === 'google-delete'}
              onChange={() => setAction('google-delete')}
            />{' '}
            Google: Remove URL
          </label>

          <label>
            <input
              type="radio"
              checked={action === 'google-status'}
              onChange={() => setAction('google-status')}
            />{' '}
            Google: Get URL status
          </label>
          <label>
            <input
              type="radio"
              name="action"
              value="indexnow"
              checked={action === 'indexnow'}
              onChange={() => setAction('indexnow')}
            />
            IndexNow: Submit URL
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={submitToAPI}
        disabled={loading}
        style={{
          padding: '13px 24px',
          border: 0,
          borderRadius: 8,
          background: loading ? '#999' : '#3155e7',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Sending...' : 'Send to API'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 35 }}>
          {results.map((result, index) => (
            <div
              key={`${result.url}-${index}`}
              style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 10,
                padding: 24,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 14,
                  marginBottom: 18,
                  wordBreak: 'break-all',
                }}
              >
                {result.url}
              </div>

              {result.success ? (
                <>
                  <div
                    style={{
                      color: '#16803c',
                      fontSize: 26,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    ✓ Success
                  </div>

                  <div
                    style={{
                      color: '#16803c',
                      fontSize: 26,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    {result.action === 'google-status'
                      ? '✓ Status Checked'
                      : '✓ Submitted Successfully'}
                  </div>
                  <div style={{ marginBottom: 10 }}>{getResultMessage(result)}</div>
                  {result.action === 'google-status' && result.inspection && (
                    <>
                      {result.inspection.coverageState && (
                        <div>
                          <strong>Coverage:</strong> {result.inspection.coverageState}
                        </div>
                      )}

                      {result.inspection.indexingState && (
                        <div>
                          <strong>Indexing:</strong> {result.inspection.indexingState}
                        </div>
                      )}

                      {result.inspection.pageFetchState && (
                        <div>
                          <strong>Page Fetch:</strong> {result.inspection.pageFetchState}
                        </div>
                      )}

                      {result.inspection.lastCrawlTime && (
                        <div>
                          <strong>Last Crawl:</strong> {formatDate(result.inspection.lastCrawlTime)}
                        </div>
                      )}
                    </>
                  )}

                  {result.timestamp && (
                    <div
                      style={{
                        marginTop: 12,
                        color: '#666',
                        fontSize: 14,
                      }}
                    >
                      Last updated: {formatDate(result.timestamp)}
                    </div>
                  )}

                  {result.inspection?.inspectionResultLink && (
                    <a
                      href={result.inspection.inspectionResultLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: 15,
                      }}
                    >
                      Open in Google Search Console
                    </a>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      color: '#c62828',
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    ✕ Error
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      color: '#c62828',
                    }}
                  >
                    {result.error}
                  </div>

                  {result.timestamp && (
                    <div
                      style={{
                        marginTop: 10,
                        color: '#666',
                        fontSize: 14,
                      }}
                    >
                      {formatDate(result.timestamp)}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowRaw((prev) => !prev)}
            style={{
              background: 'transparent',
              border: '1px solid #3155e7',
              borderRadius: 8,
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            {showRaw ? 'Hide Raw Response' : 'Show Raw Response'}
          </button>

          {showRaw && (
            <pre
              style={{
                marginTop: 15,
                padding: 18,
                background: '#111',
                color: '#eee',
                borderRadius: 8,
                overflowX: 'auto',
                fontSize: 13,
              }}
            >
              {JSON.stringify(rawResponse ?? null, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
