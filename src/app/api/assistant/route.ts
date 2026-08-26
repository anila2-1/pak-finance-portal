import { NextRequest, NextResponse } from 'next/server'
import { getDailyRates } from '@/lib/getDailyRates'
import { getPayload } from '@/lib/payload'
import config from '@payload-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface Needs {
  dailyRates: boolean
  prizeBonds: boolean
  posts: boolean
  categories: boolean
  tags: boolean
  topUpdates: boolean
}

interface CMSContext {
  dailyRates: any | null
  prizeBonds: any[]
  posts: any[]
  categories: any[]
  tags: any[]
  topUpdates: any | null
}

const MAX_QUESTION_LENGTH = 2000
const MAX_HISTORY_MESSAGES = 8
const GEMINI_TIMEOUT_MS = 15000
const CMS_TIMEOUT_MS = 7000

function formatNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Not available'
  const number = Number(value)
  return Number.isNaN(number) ? String(value) : number.toLocaleString('en-PK')
}

function formatDate(value: unknown) {
  if (!value) return 'Not available'

  const date = new Date(String(value))

  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  })
}

function getPakistanToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function normalize(value: unknown) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasAny(q: string, words: string[]) {
  return words.some((word) => q.includes(word))
}

/*
 * Only load the CMS collections that can actually help answer
 * the current question. This is the main performance improvement.
 */
function detectNeeds(question: string): Needs {
  const q = normalize(question)

  const dailyRates = hasAny(q, [
    'gold',
    'sona',
    '24k',
    '22k',
    'tola',
    'gram',
    'dollar',
    'usd',
    'pkr',
    'currency',
    'exchange rate',
    'petrol',
    'diesel',
    'fuel',
    'kse',
    'kse100',
    'kse-100',
    'stock market',
    'stock index',
    'market rate',
    'rate',
    'price',
    'prices',
    'today rate',
    'today price',
    'latest rate',
  ])

  const prizeBonds = hasAny(q, [
    'prize bond',
    'prize bonds',
    'prizebond',
    'bond result',
    'bond results',
    'draw result',
    'draw number',
    'winning number',
    'winning numbers',
    'denomination',
    '750 bond',
    '1500 bond',
    '100 bond',
    '200 bond',
    '40000 bond',
    '25000 bond',
  ])

  const posts = hasAny(q, [
    'article',
    'articles',
    'post',
    'posts',
    'news',
    'latest news',
    'financial news',
    'latest update',
    'latest updates',
    'published',
    'read on hamariinfo',
    'on hamariinfo',
    'website article',
    'website post',
    'what did hamariinfo publish',
  ])

  const categories = hasAny(q, [
    'category',
    'categories',
    'section',
    'sections',
    'what topics',
    'topics on website',
  ])

  const tags = hasAny(q, ['tag', 'tags', 'keyword tags'])

  const topUpdates = hasAny(q, [
    'top update',
    'top updates',
    'breaking update',
    'headline',
    'headlines',
    'ticker',
    'latest update',
  ])

  return {
    dailyRates,
    prizeBonds,
    posts,
    categories,
    tags,
    topUpdates,
  }
}

function cleanCMSValue(value: any, depth = 0): any {
  if (depth > 4) return undefined

  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (value instanceof Date) return value.toISOString()

  if (Array.isArray(value)) {
    return value
      .slice(0, 50)
      .map((item) => cleanCMSValue(item, depth + 1))
      .filter((item) => item !== undefined)
  }

  if (typeof value === 'object') {
    const result: Record<string, any> = {}

    for (const [key, item] of Object.entries(value)) {
      if (
        key === 'password' ||
        key === 'salt' ||
        key === 'hash' ||
        key === 'token' ||
        key === 'secret' ||
        key === 'apiKey' ||
        key === 'accessToken'
      ) {
        continue
      }

      const cleaned = cleanCMSValue(item, depth + 1)

      if (cleaned !== undefined) {
        result[key] = cleaned
      }
    }

    return result
  }

  return undefined
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs)
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

async function getWebsiteCMSContext(needs: Needs): Promise<CMSContext> {
  const context: CMSContext = {
    dailyRates: null,
    prizeBonds: [],
    posts: [],
    categories: [],
    tags: [],
    topUpdates: null,
  }

  const tasks: Promise<void>[] = []

  if (needs.dailyRates) {
    tasks.push(
      withTimeout(getDailyRates(), CMS_TIMEOUT_MS, 'Daily rates')
        .then((rates) => {
          context.dailyRates = rates
        })
        .catch((error) => {
          console.error('Daily rates error:', error)
        }),
    )
  }

  const needsPayload =
    needs.prizeBonds || needs.posts || needs.categories || needs.tags || needs.topUpdates

  if (!needsPayload) {
    await Promise.allSettled(tasks)
    return context
  }

  let payload: Awaited<ReturnType<typeof getPayload>> | null = null

  try {
    payload = await withTimeout(getPayload({ config }), CMS_TIMEOUT_MS, 'Payload')
  } catch (error) {
    console.error('Payload initialization error:', error)
    await Promise.allSettled(tasks)
    return context
  }

  if (needs.prizeBonds) {
    tasks.push(
      withTimeout(
        payload.find({
          collection: 'prize-bond-draws',
          limit: 50,
          sort: '-createdAt',
          depth: 1,
        }),
        CMS_TIMEOUT_MS,
        'Prize bonds',
      )
        .then((result) => {
          context.prizeBonds = result.docs || []
        })
        .catch((error) => {
          console.error('Prize bonds error:', error)
        }),
    )
  }

  if (needs.posts) {
    tasks.push(
      withTimeout(
        payload.find({
          collection: 'posts',
          limit: 15,
          sort: '-publishedAt',
          depth: 1,
        }),
        CMS_TIMEOUT_MS,
        'Posts',
      )
        .then((result) => {
          context.posts = result.docs || []
        })
        .catch((error) => {
          console.error('Posts error:', error)
        }),
    )
  }

  if (needs.categories) {
    tasks.push(
      withTimeout(
        payload.find({
          collection: 'categories',
          limit: 50,
          sort: 'name',
          depth: 0,
        }),
        CMS_TIMEOUT_MS,
        'Categories',
      )
        .then((result) => {
          context.categories = result.docs || []
        })
        .catch((error) => {
          console.error('Categories error:', error)
        }),
    )
  }

  if (needs.tags) {
    tasks.push(
      withTimeout(
        payload.find({
          collection: 'tags',
          limit: 100,
          sort: 'name',
          depth: 0,
        }),
        CMS_TIMEOUT_MS,
        'Tags',
      )
        .then((result) => {
          context.tags = result.docs || []
        })
        .catch((error) => {
          console.error('Tags error:', error)
        }),
    )
  }

  if (needs.topUpdates) {
    tasks.push(
      withTimeout(
        payload.findGlobal({
          slug: 'top-updates',
          depth: 1,
        }),
        CMS_TIMEOUT_MS,
        'Top updates',
      )
        .then((result) => {
          context.topUpdates = result
        })
        .catch((error) => {
          console.error('Top updates error:', error)
        }),
    )
  }

  await Promise.allSettled(tasks)

  return context
}

function buildDailyRatesContext(rates: any) {
  if (!rates) {
    return `
DAILY RATES
No daily rate record was available from HamariInfo CMS.
Never invent current rates.
`
  }

  const date = formatDate(rates.date)
  const today = getPakistanToday()

  return `
DAILY RATES FROM HAMARIINFO CMS

Data date: ${date}
Today in Pakistan: ${today}

Gold:
24K: Rs. ${formatNumber(rates.gold?.gold24k)} per tola
22K: Rs. ${formatNumber(rates.gold?.gold22k)} per tola

USD / PKR:
Buying: Rs. ${formatNumber(rates.currency?.usdBuying)}
Selling: Rs. ${formatNumber(rates.currency?.usdSelling)}

Fuel:
Petrol: Rs. ${formatNumber(rates.fuel?.petrol)} per litre

KSE-100:
Index: ${formatNumber(rates.stock?.kse100Index)}
Change: ${rates.stock?.kse100Change ?? 'Not available'}

Source: ${rates.source ?? 'HamariInfo CMS'}
Notes: ${rates.notes ?? 'None'}

DATE RULE:
These values belong to ${date}.
If ${date} is not today's Pakistan date, do not call them today's or live rates.
Never estimate or create a newer value.
`
}

function buildPrizeBondContext(prizeBonds: any[]) {
  if (!prizeBonds.length) {
    return `
PRIZE BONDS
No prize bond records are currently available in HamariInfo CMS.
Never invent a draw number, winning number, date or prize amount.
`
  }

  const cleaned = prizeBonds.map((bond) => cleanCMSValue(bond)).filter(Boolean)

  return `
PRIZE BOND DATA FROM HAMARIINFO CMS

These are exact CMS records. Use them for denomination, draw date,
draw number, winning numbers and prize amounts.

Never invent or alter a result.

${JSON.stringify(cleaned, null, 2)}
`
}

function buildPostsContext(posts: any[]) {
  if (!posts.length) {
    return `
WEBSITE POSTS
No matching/recent posts are available in the current CMS context.
`
  }

  const simplified = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    description: post.description,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    category: post.category,
    categories: post.categories,
    tags: post.tags,
    author: post.author,
    content: post.content,
  }))

  return `
HAMARIINFO WEBSITE POSTS

Use these records for questions about articles and website news.
Do not invent article titles or details not contained here.

${JSON.stringify(cleanCMSValue(simplified), null, 2)}
`
}

function buildTaxonomyContext(categories: any[], tags: any[]) {
  return `
HAMARIINFO CATEGORIES
${JSON.stringify(cleanCMSValue(categories), null, 2)}

HAMARIINFO TAGS
${JSON.stringify(cleanCMSValue(tags), null, 2)}
`
}

function buildTopUpdatesContext(topUpdates: any) {
  if (!topUpdates) {
    return `
HAMARIINFO TOP UPDATES
No top updates are currently available in CMS.
`
  }

  return `
HAMARIINFO TOP UPDATES
${JSON.stringify(cleanCMSValue(topUpdates), null, 2)}
`
}

function buildWebsiteContext(context: CMSContext, needs: Needs) {
  const sections: string[] = []

  if (needs.dailyRates) {
    sections.push(buildDailyRatesContext(context.dailyRates))
  }

  if (needs.prizeBonds) {
    sections.push(buildPrizeBondContext(context.prizeBonds))
  }

  if (needs.posts) {
    sections.push(buildPostsContext(context.posts))
  }

  if (needs.categories || needs.tags) {
    sections.push(
      buildTaxonomyContext(
        needs.categories ? context.categories : [],
        needs.tags ? context.tags : [],
      ),
    )
  }

  if (needs.topUpdates) {
    sections.push(buildTopUpdatesContext(context.topUpdates))
  }

  if (!sections.length) {
    return 'No website-specific CMS context is required for this question.'
  }

  return `
HAMARIINFO WEBSITE CMS CONTEXT

The CMS is authoritative for website-specific information.

${sections.join('\n\n')}

END HAMARIINFO CMS CONTEXT
`
}

function buildHistory(history: ChatMessage[]) {
  return history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => {
      const role = message.role === 'assistant' ? 'Assistant' : 'User'
      return `${role}: ${message.content.slice(0, 3000)}`
    })
    .join('\n')
}

function fallbackAnswer(question: string, context: CMSContext) {
  const q = normalize(question)
  const rates = context.dailyRates

  if (rates && hasAny(q, ['gold', 'sona', '24k', '22k', 'tola'])) {
    return `The latest gold data on HamariInfo is dated ${formatDate(
      rates.date,
    )}. 24K gold is Rs. ${formatNumber(
      rates.gold?.gold24k,
    )} per tola and 22K gold is Rs. ${formatNumber(rates.gold?.gold22k)} per tola.`
  }

  if (rates && hasAny(q, ['dollar', 'usd', 'currency', 'pkr', 'exchange rate'])) {
    return `The latest USD/PKR data on HamariInfo is dated ${formatDate(
      rates.date,
    )}. The buying rate is Rs. ${formatNumber(
      rates.currency?.usdBuying,
    )} and the selling rate is Rs. ${formatNumber(rates.currency?.usdSelling)} per US dollar.`
  }

  if (rates && hasAny(q, ['petrol', 'fuel', 'diesel'])) {
    return `The latest petrol data on HamariInfo is dated ${formatDate(
      rates.date,
    )}. The petrol price is Rs. ${formatNumber(rates.fuel?.petrol)} per litre.`
  }

  if (rates && hasAny(q, ['kse', 'kse100', 'kse-100', 'stock market', 'stock index'])) {
    return `The latest KSE-100 data on HamariInfo is dated ${formatDate(
      rates.date,
    )}. The index is ${formatNumber(rates.stock?.kse100Index)} points and the change is ${
      rates.stock?.kse100Change ?? 'not available'
    }.`
  }

  if (context.prizeBonds.length) {
    return 'I could not generate the AI response right now. Please try the prize bond question again.'
  }

  return 'The AI assistant is temporarily unavailable. Please try again in a moment.'
}

async function callGemini(
  apiKey: string,
  model: string,
  systemInstruction: string,
  prompt: string,
) {
  const controller = new AbortController()

  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)

  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            thinkingConfig: {
              thinkingLevel: 'low',
            },
            maxOutputTokens: 800,
          },
        }),
        signal: controller.signal,
      },
    )
  } finally {
    clearTimeout(timer)
  }
}

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for HamariInfo, a Pakistani information and finance portal.

You are a general-purpose conversational assistant. You are NOT limited to finance.
You can answer normal questions, explain concepts, discuss Pakistan finance, banking,
taxes, savings, gold, currencies, petrol, KSE-100, prize bonds, government schemes,
business, technology, education, everyday topics and questions about HamariInfo.

LANGUAGE:
- English -> English
- Roman Urdu -> Roman Urdu
- Urdu -> Urdu
- Mixed language -> naturally match the user's style

WEBSITE DATA RULE:
HamariInfo CMS data supplied in the user prompt is authoritative for website-specific
information.

Use general model knowledge for general questions.

Use CMS data for:
- HamariInfo rates
- HamariInfo prize bond results
- HamariInfo articles/posts
- HamariInfo categories/tags
- HamariInfo top updates

Never invent website-specific numbers, dates, article titles, winning numbers,
draw numbers, prize amounts or rates.

If the requested website-specific information is missing from the supplied CMS context,
say that it is not currently available on HamariInfo. Do not guess.

DATE RULE:
Never turn an older CMS date into today's date.
If CMS data is dated earlier than today, explicitly use its real date.

PRIZE BOND RULE:
Prize bond results must be exact.
Only provide a winning number, draw number, denomination, date or prize amount when
it exists in the supplied CMS records.

CONVERSATION:
Answer the user's actual question directly.
Do not force every question toward finance.
Do not repeatedly mention "CMS".
Do not unnecessarily say that you are an AI.
For simple questions, be concise.
For complex questions, explain clearly with useful structure.

FINANCIAL SAFETY:
General financial education is allowed.
For personalized investment decisions, make clear that the answer is general information,
not personalized financial advice. Never guarantee profit or present uncertain predictions
as facts.

IMPORTANT:
Do not say "I can only answer finance questions."
You can answer general questions normally.
`

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  try {
    const body = await request.json()

    const question = String(body?.question || '').trim()

    const history: ChatMessage[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (message: any) =>
              message &&
              (message.role === 'user' || message.role === 'assistant') &&
              typeof message.content === 'string',
          )
          .slice(-MAX_HISTORY_MESSAGES)
      : []

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a question.',
        },
        { status: 400 },
      )
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: 'Question is too long.',
        },
        { status: 400 },
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    const needs = detectNeeds(question)
    const context = await getWebsiteCMSContext(needs)

    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing.')

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, context),
        source: 'HamariInfo CMS',
        ai: false,
        fallback: true,
        elapsedMs: Date.now() - startedAt,
      })
    }

    const websiteContext = buildWebsiteContext(context, needs)

    const previousConversation = buildHistory(history)

    const prompt = `
USER QUESTION:
${question}

PREVIOUS CONVERSATION:
${previousConversation || 'No previous conversation.'}

WEBSITE CONTEXT:
${websiteContext}

INSTRUCTIONS:
Answer the user's question directly.

If the question is general, answer from your general knowledge.

If the question asks for HamariInfo-specific information, use the supplied website context.

If exact website data is missing, say it is not currently available on HamariInfo.
Never invent missing website data.
`

    const model = process.env.GEMINI_MODEL || 'gemini-3.7-flash'

    let response: Response

    try {
      response = await callGemini(apiKey, model, SYSTEM_INSTRUCTION, prompt)
    } catch (error) {
      console.error('Gemini request failed:', error)

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, context),
        source: context.dailyRates?.source || 'HamariInfo CMS',
        ai: false,
        fallback: true,
        elapsedMs: Date.now() - startedAt,
      })
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')

      console.error('Gemini API error:', response.status, errorText)

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, context),
        source: context.dailyRates?.source || 'HamariInfo CMS',
        ai: false,
        fallback: true,
        elapsedMs: Date.now() - startedAt,
      })
    }

    const data = await response.json()
    const candidate = data?.candidates?.[0]

    const answer = Array.isArray(candidate?.content?.parts)
      ? candidate.content.parts
          .filter((part: any) => typeof part?.text === 'string' && part.text.trim())
          .map((part: any) => part.text.trim())
          .join(' ')
          .trim()
      : ''

    if (!answer) {
      console.warn('Gemini returned an empty answer:', {
        finishReason: candidate?.finishReason,
      })

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, context),
        source: context.dailyRates?.source || 'HamariInfo CMS',
        ai: false,
        fallback: true,
        elapsedMs: Date.now() - startedAt,
      })
    }

    return NextResponse.json({
      success: true,
      answer,
      source: Object.values(needs).some(Boolean) ? 'Gemini AI + HamariInfo CMS' : 'Gemini AI',
      ai: true,
      fallback: false,
      elapsedMs: Date.now() - startedAt,
    })
  } catch (error) {
    console.error('HamariInfo Assistant API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong. Please try again.',
      },
      { status: 500 },
    )
  }
}
