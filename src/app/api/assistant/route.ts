import { NextRequest, NextResponse } from 'next/server'
import { getDailyRates } from '@/lib/getDailyRates'
import { getPayload } from '@/lib/payload'
import config from '@payload-config'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CMSContext {
  dailyRates: any
  prizeBonds: any[]
  posts: any[]
  categories: any[]
  tags: any[]
  topUpdates: any
}

/* =========================================================
   BASIC HELPERS
========================================================= */

function formatNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return String(value)
  }

  return number.toLocaleString('en-PK')
}

function formatDate(value: unknown) {
  if (!value) return 'Not available'

  try {
    return new Date(String(value)).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Karachi',
    })
  } catch {
    return String(value)
  }
}

function getPakistanToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/* =========================================================
   SAFE VALUE CLEANER
========================================================= */

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

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 50)
      .map((item) => cleanCMSValue(item, depth + 1))
      .filter((item) => item !== undefined)
  }

  if (typeof value === 'object') {
    const result: Record<string, any> = {}

    for (const [key, item] of Object.entries(value)) {
      // Never expose internal/system fields.
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

/* =========================================================
   GET CMS DATA
========================================================= */

async function getWebsiteCMSContext(question: string): Promise<CMSContext> {
  let dailyRates: any = null
  let prizeBonds: any[] = []
  let posts: any[] = []
  let categories: any[] = []
  let tags: any[] = []
  let topUpdates: any = null

  /*
   * Daily rates
   */
  try {
    dailyRates = await getDailyRates()
  } catch (error) {
    console.error('Daily rates error:', error)
  }

  /*
   * Payload CMS
   */
  try {
    const payload = await getPayload({ config })

    /*
     * Prize Bonds
     *
     * We intentionally get a reasonable number of records.
     * This gives the AI access to recent draw/result information
     * without sending the entire database to Gemini.
     */
    try {
      const prizeBondResult = await payload.find({
        collection: 'prize-bond-draws',
        limit: 50,
        sort: '-createdAt',
        depth: 1,
      })

      prizeBonds = prizeBondResult.docs || []
    } catch (error) {
      console.warn('Prize bonds collection unavailable:', error)
    }

    /*
     * Recent posts
     */
    try {
      const postResult = await payload.find({
        collection: 'posts',
        limit: 20,
        sort: '-publishedAt',
        depth: 1,
      })

      posts = postResult.docs || []
    } catch (error) {
      console.warn('Posts collection unavailable:', error)
    }

    /*
     * Categories
     */
    try {
      const categoryResult = await payload.find({
        collection: 'categories',
        limit: 50,
        depth: 1,
      })

      categories = categoryResult.docs || []
    } catch (error) {
      console.warn('Categories collection unavailable:', error)
    }

    /*
     * Tags
     */
    try {
      const tagResult = await payload.find({
        collection: 'tags',
        limit: 100,
        depth: 1,
      })

      tags = tagResult.docs || []
    } catch (error) {
      console.warn('Tags collection unavailable:', error)
    }

    /*
     * Top Updates Global
     *
     * If your global slug is different, change it here.
     */
    try {
      topUpdates = await payload.findGlobal({
        slug: 'top-updates',
        depth: 2,
      })
    } catch (error) {
      console.warn('Top updates global unavailable:', error)
    }
  } catch (error) {
    console.error('Payload CMS error:', error)
  }

  return {
    dailyRates,
    prizeBonds,
    posts,
    categories,
    tags,
    topUpdates,
  }
}

/* =========================================================
   BUILD DAILY RATES CONTEXT
========================================================= */

function buildDailyRatesContext(rates: any) {
  if (!rates) {
    return `
DAILY RATES
No daily rate record is currently available in the website CMS.

Do not invent current rates.
`
  }

  const date = formatDate(rates.date)
  const today = getPakistanToday()

  return `
DAILY HamarInfo FROM WEBSITE CMS
=======================================

DATA DATE:
${date}

TODAY IN PAKISTAN:
${today}

GOLD
24K Gold:
Rs. ${formatNumber(rates.gold?.gold24k)} per tola

22K Gold:
Rs. ${formatNumber(rates.gold?.gold22k)} per tola

CURRENCY
USD Buying:
Rs. ${formatNumber(rates.currency?.usdBuying)}

USD Selling:
Rs. ${formatNumber(rates.currency?.usdSelling)}

FUEL
Petrol:
Rs. ${formatNumber(rates.fuel?.petrol)} per litre

KSE-100
Index:
${formatNumber(rates.stock?.kse100Index)}

Change:
${rates.stock?.kse100Change ?? 'Not available'}

SOURCE:
${rates.source ?? 'Website CMS'}

NOTES:
${rates.notes ?? 'No additional notes.'}

IMPORTANT DATE RULE:
These values belong to ${date}.

If this date is different from today's Pakistan date, do NOT call these
numbers today's rates, today's prices or live rates.

Say that these are the latest available website figures dated ${date}.

Never update, estimate or invent a newer value.
`
}

/* =========================================================
   BUILD PRIZE BOND CONTEXT
========================================================= */

function buildPrizeBondContext(prizeBonds: any[]) {
  if (!prizeBonds.length) {
    return `
PRIZE BONDS
No prize bond records are currently available from the website CMS.

Do not invent prize bond draw numbers, winning numbers, dates or prizes.
`
  }

  const cleaned = prizeBonds.map((bond) => cleanCMSValue(bond)).filter(Boolean)

  return `
PRIZE BOND DATA FROM WEBSITE CMS
================================

The following prize bond records come directly from the website CMS.

Use these records when the user asks about prize bond results, draw dates,
draw numbers, denominations, winning numbers or prize information.

Never invent a result that does not exist in this CMS data.

${JSON.stringify(cleaned, null, 2)}
`
}

/* =========================================================
   BUILD POSTS CONTEXT
========================================================= */

function buildPostsContext(posts: any[]) {
  if (!posts.length) {
    return `
WEBSITE POSTS
No posts are currently available in the CMS context.
`
  }

  const simplifiedPosts = posts.map((post) => ({
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
  }))

  return `
RECENT WEBSITE POSTS
====================

These are recent articles available on the website.

Use them when relevant to the user's question.

${JSON.stringify(cleanCMSValue(simplifiedPosts), null, 2)}
`
}

/* =========================================================
   BUILD CATEGORY / TAG CONTEXT
========================================================= */

function buildTaxonomyContext(categories: any[], tags: any[]) {
  return `
WEBSITE CATEGORIES
==================

${JSON.stringify(cleanCMSValue(categories), null, 2)}

WEBSITE TAGS
============

${JSON.stringify(cleanCMSValue(tags), null, 2)}
`
}

/* =========================================================
   BUILD TOP UPDATES CONTEXT
========================================================= */

function buildTopUpdatesContext(topUpdates: any) {
  if (!topUpdates) {
    return `
TOP UPDATES
No top updates data is currently available.
`
  }

  return `
WEBSITE TOP UPDATES
===================

${JSON.stringify(cleanCMSValue(topUpdates), null, 2)}
`
}

/* =========================================================
   COMPLETE WEBSITE CONTEXT
========================================================= */

function buildWebsiteContext(context: CMSContext) {
  return `
============================================================
WEBSITE CMS CONTEXT
============================================================

This is information currently available in the HamarInfo.

The CMS is the authoritative source for website-specific information.

${buildDailyRatesContext(context.dailyRates)}

${buildPrizeBondContext(context.prizeBonds)}

${buildPostsContext(context.posts)}

${buildTaxonomyContext(context.categories, context.tags)}

${buildTopUpdatesContext(context.topUpdates)}

============================================================
END WEBSITE CMS CONTEXT
============================================================
`
}

/* =========================================================
   GEMINI REQUEST
========================================================= */

async function callGemini(
  apiKey: string,
  model: string,
  systemInstruction: string,
  prompt: string,
) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` + `${model}:generateContent`

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: systemInstruction,
          },
        ],
      },

      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
      },
    }),
  })
}

/* =========================================================
   SAFE FALLBACK
========================================================= */

function fallbackAnswer(question: string, context: CMSContext) {
  const q = question.toLowerCase()
  const rates = context.dailyRates

  if (!rates) {
    return 'I could not find the requested current information in the website data.'
  }

  const date = formatDate(rates.date)

  if (q.includes('gold') || q.includes('sona') || q.includes('24k') || q.includes('22k')) {
    return `The latest gold data available on the website is dated ${date}. 24K gold is Rs. ${formatNumber(
      rates.gold?.gold24k,
    )} per tola and 22K gold is Rs. ${formatNumber(rates.gold?.gold22k)} per tola.`
  }

  if (
    q.includes('dollar') ||
    q.includes('usd') ||
    q.includes('currency') ||
    q.includes('pkr') ||
    q.includes('exchange rate')
  ) {
    return `The latest USD/PKR data available on the website is dated ${date}. The buying rate is Rs. ${formatNumber(
      rates.currency?.usdBuying,
    )} and the selling rate is Rs. ${formatNumber(rates.currency?.usdSelling)} per US dollar.`
  }

  if (q.includes('petrol') || q.includes('fuel') || q.includes('diesel')) {
    return `The latest petrol data available on the website is dated ${date}. The petrol price is Rs. ${formatNumber(
      rates.fuel?.petrol,
    )} per litre.`
  }

  if (q.includes('kse') || q.includes('stock market') || q.includes('stock index')) {
    return `The latest KSE-100 data available on the website is dated ${date}. The index is ${formatNumber(
      rates.stock?.kse100Index,
    )} points, with a change of ${rates.stock?.kse100Change ?? 'not available'}.`
  }

  return 'I could not generate an AI response right now. Please try your question again.'
}

/* =========================================================
   POST
========================================================= */

export async function POST(request: NextRequest) {
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
          .slice(-12)
      : []

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a question.',
        },
        { status: 400 },
      )
    }

    if (question.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Question is too long.',
        },
        { status: 400 },
      )
    }

    /* -------------------------------------------------------
       API CONFIG
    ------------------------------------------------------- */

    const apiKey = process.env.GEMINI_API_KEY

    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

    /* -------------------------------------------------------
       GET WEBSITE DATA
    ------------------------------------------------------- */

    const websiteContextData = await getWebsiteCMSContext(question)

    const websiteContext = buildWebsiteContext(websiteContextData)

    /* -------------------------------------------------------
       NO API KEY
    ------------------------------------------------------- */

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, websiteContextData),
        source: websiteContextData.dailyRates?.source || 'Website CMS',
        ai: false,
        fallback: true,
      })
    }

    /* -------------------------------------------------------
       PREVIOUS CONVERSATION
    ------------------------------------------------------- */

    const previousConversation = history
      .map((message) => {
        const role = message.role === 'assistant' ? 'Assistant' : 'User'

        return `${role}: ${message.content}`
      })
      .join('\n')

    /* -------------------------------------------------------
       SYSTEM INSTRUCTION
    ------------------------------------------------------- */

    const systemInstruction = `
You are the official AI assistant for the Pakistan HamarInfo website.

You are a general-purpose conversational AI assistant with strong
knowledge of Pakistan finance, economics, banking, taxation,
personal finance, current financial concepts and general topics.

You are NOT restricted to only gold, dollar, petrol, KSE or prize bonds.

You can answer:

- General questions
- Pakistan finance questions
- Financial education
- Gold questions
- Currency questions
- Dollar questions
- Petrol and fuel questions
- KSE-100 questions
- Stock market concepts
- Prize bond questions
- Prize bond results
- Prize bond draw information
- Banking questions
- Savings questions
- Tax questions
- FBR concepts
- Inflation
- GDP
- Interest rates
- Loans
- Government financial schemes
- Personal finance
- Investment education
- Business questions
- Economy questions
- Technology questions
- Everyday general questions
- Questions about articles published on this website
- Questions about information stored in the website CMS

============================================================
MOST IMPORTANT RULE
============================================================

You have two kinds of knowledge.

1. Your general model knowledge.
2. Information supplied by the website CMS.

For normal educational or general questions, use your knowledge.

For WEBSITE-SPECIFIC information, use the CMS context.

Examples:

"What is inflation?"
Answer normally.

"What is compound interest?"
Answer normally.

"What is GDP?"
Answer normally.

"What is today's gold rate?"
Use the CMS daily rates.

"What is the USD rate?"
Use the CMS daily rates.

"What is the latest prize bond result?"
Use the CMS prize bond records.

"What was the prize bond draw number?"
Use the CMS prize bond records.

"What are the latest articles on the website?"
Use the CMS posts.

"What categories does the website have?"
Use CMS categories.

"What is the latest update?"
Use the Top Updates CMS context.

============================================================
CMS DATA SAFETY
============================================================

Never invent website-specific information.

Never invent:

- Gold prices
- Dollar rates
- Petrol prices
- KSE values
- Prize bond numbers
- Prize bond winning numbers
- Prize bond draw dates
- Prize amounts
- Website article titles
- Website statistics
- Website-specific updates

If the requested website information is not present in the supplied
CMS context, clearly say that the information is not currently
available in the website data.

Do NOT pretend that missing CMS information exists.

============================================================
DATE RULE
============================================================

Always respect dates supplied by the CMS.

If a rate is dated yesterday or an earlier date, do not call it
"today's rate" or "live rate".

Instead say:

"The latest available data on the website is from [date]."

Never change the CMS date.

Never estimate a newer value.

============================================================
PRIZE BOND RULE
============================================================

Prize bond information is especially sensitive to exact numbers.

If a prize bond result is available in the CMS:

Give the exact information from the CMS.

If the requested denomination, draw number, date or winning number
is not available:

Say that the requested result is not currently available in the
website data.

Never guess a prize bond result.

============================================================
FINANCIAL ADVICE
============================================================

You may explain investments and financial decisions educationally.

For personalized financial decisions, clearly state that the answer
is general information and not personalized financial advice.

Do not guarantee profits.

Do not present uncertain predictions as facts.

============================================================
LANGUAGE
============================================================

If the user writes English, answer in English.

If the user writes Roman Urdu, answer in Roman Urdu.

If the user writes Urdu, answer in Urdu.

If the user mixes English and Roman Urdu, naturally match their style.

============================================================
CONVERSATION STYLE
============================================================

Be natural and conversational.

Do not repeatedly say "According to the CMS".

Do not unnecessarily mention that you are an AI.

Answer the actual question directly.

Do not force every conversation toward finance.

If someone says "hello", respond naturally.

If someone asks a joke, general question or everyday question,
answer normally.

If someone asks about Pakistan finance, provide useful detail.

Use short paragraphs.

Use bullets when they make the answer easier to read.

For simple questions, keep the answer concise.

For complex questions, explain properly.

============================================================
WEBSITE CONTEXT
============================================================

The following information comes from the HamarInfo website CMS.

Treat it as authoritative for website-specific information.

${websiteContext}
`

    /* -------------------------------------------------------
       USER PROMPT
    ------------------------------------------------------- */

    const prompt = `
USER QUESTION:

${question}

PREVIOUS CONVERSATION:

${previousConversation || 'No previous conversation.'}

Answer the user's question directly.

If the question asks for website-specific current information,
use the supplied CMS context.

If the CMS does not contain the requested website-specific
information, say that it is not currently available.

If the question is general, answer normally using your knowledge.

Do not invent missing website data.
`

    /* -------------------------------------------------------
       GEMINI RETRIES
    ------------------------------------------------------- */

    let response: Response | null = null
    let lastError = ''

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await callGemini(apiKey, model, systemInstruction, prompt)

        if (response.ok) {
          break
        }

        lastError = await response.text()

        console.error(`Gemini API attempt ${attempt} failed:`, lastError)

        /*
         * Retry temporary failures only.
         */
        if (
          response.status !== 429 &&
          response.status !== 500 &&
          response.status !== 502 &&
          response.status !== 503 &&
          response.status !== 504
        ) {
          break
        }

        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1200))
        }
      } catch (error) {
        lastError = String(error)

        console.error(`Gemini request attempt ${attempt} failed:`, error)

        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1200))
        }
      }
    }

    /* -------------------------------------------------------
       GEMINI FAILED
    ------------------------------------------------------- */

    if (!response || !response.ok) {
      console.error('Gemini ultimately failed:', lastError)

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, websiteContextData),
        source: websiteContextData.dailyRates?.source || 'Website CMS',
        ai: false,
        fallback: true,
      })
    }

    /* -------------------------------------------------------
       PARSE RESPONSE
    ------------------------------------------------------- */

    const data = await response.json()

    const candidate = data?.candidates?.[0]

    const parts = candidate?.content?.parts

    const answer = Array.isArray(parts)
      ? parts
          .filter((part: any) => typeof part?.text === 'string' && part.text.trim())
          .map((part: any) => part.text.trim())
          .join(' ')
          .trim()
      : ''

    /* -------------------------------------------------------
       EMPTY RESPONSE
    ------------------------------------------------------- */

    if (!answer) {
      console.warn('Gemini returned no usable answer.')

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, websiteContextData),
        source: websiteContextData.dailyRates?.source || 'Website CMS',
        ai: false,
        fallback: true,
      })
    }

    /* -------------------------------------------------------
       SUCCESS
    ------------------------------------------------------- */

    return NextResponse.json({
      success: true,
      answer,
      source: 'Gemini AI + HamarInfo CMS',
      ai: true,
      fallback: false,
    })
  } catch (error) {
    console.error('Assistant API error:', error)

    /*
     * Last-resort response.
     */
    try {
      const rates = await getDailyRates()

      return NextResponse.json({
        success: true,
        answer: rates
          ? `The latest HamariInfo data available on the website is dated ${formatDate(rates.date)}.`
          : 'The requested information is currently unavailable.',
        source: rates?.source || 'Website CMS',
        ai: false,
        fallback: true,
      })
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Something went wrong. Please try again.',
        },
        { status: 500 },
      )
    }
  }
}
