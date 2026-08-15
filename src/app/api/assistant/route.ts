import { NextRequest, NextResponse } from 'next/server'
import { getDailyRates } from '@/lib/getDailyRates'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/* -------------------------------------------------------
   FORMAT RATE
------------------------------------------------------- */

function formatRate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return String(value)
  }

  return number.toLocaleString('en-PK')
}

/* -------------------------------------------------------
   FORMAT DATE
------------------------------------------------------- */

function formatRateDate(value: unknown) {
  if (!value) return 'Not available'

  try {
    return new Date(String(value)).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return String(value)
  }
}

/* -------------------------------------------------------
   FINANCE CONTEXT
------------------------------------------------------- */

function buildFinanceContext(rates: any) {
  if (!rates) {
    return `
CURRENT PAKISTAN FINANCE DATA

No daily rate record is currently available from Pakistan Finance.

IMPORTANT:
Do not invent or guess any financial rate.
If the user asks for a current rate, clearly say the data is unavailable.
`
  }

  return `
CURRENT PAKISTAN FINANCE DATA
=============================

DATE:
${formatRateDate(rates.date)}

GOLD:
24K Gold: Rs. ${formatRate(rates.gold?.gold24k)} per tola
22K Gold: Rs. ${formatRate(rates.gold?.gold22k)} per tola

USD / PKR:
USD Buying: Rs. ${formatRate(rates.currency?.usdBuying)} per USD
USD Selling: Rs. ${formatRate(rates.currency?.usdSelling)} per USD

FUEL:
Petrol: Rs. ${formatRate(rates.fuel?.petrol)} per litre

KSE-100:
Index: ${formatRate(rates.stock?.kse100Index)} points
Change: ${rates.stock?.kse100Change ?? 'Not available'}

SOURCE:
${rates.source ?? 'Pakistan Finance'}

NOTES:
${rates.notes ?? 'No additional notes.'}
`
}

/* -------------------------------------------------------
   LOCAL FALLBACK
------------------------------------------------------- */

function fallbackAnswer(question: string, rates: any) {
  const q = question.toLowerCase()

  if (!rates) {
    return "I'm sorry, the latest financial rate data is currently unavailable."
  }

  const rateDate = formatRateDate(rates.date)

  /* GOLD */

  if (q.includes('gold') || q.includes('sona') || q.includes('24k') || q.includes('22k')) {
    return `As of ${rateDate}, 24K gold is Rs. ${formatRate(
      rates.gold?.gold24k,
    )} per tola and 22K gold is Rs. ${formatRate(rates.gold?.gold22k)} per tola.`
  }

  /* USD */

  if (
    q.includes('usd') ||
    q.includes('dollar') ||
    q.includes('currency') ||
    q.includes('pkr') ||
    q.includes('exchange rate')
  ) {
    return `As of ${rateDate}, the USD/PKR buying rate is Rs. ${formatRate(
      rates.currency?.usdBuying,
    )} and the selling rate is Rs. ${formatRate(rates.currency?.usdSelling)} per US dollar.`
  }

  /* PETROL */

  if (q.includes('petrol') || q.includes('fuel') || q.includes('petroleum')) {
    return `As of ${rateDate}, the petrol price is Rs. ${formatRate(rates.fuel?.petrol)} per litre.`
  }

  /* KSE */

  if (
    q.includes('kse') ||
    q.includes('kse-100') ||
    q.includes('stock') ||
    q.includes('market index')
  ) {
    return `As of ${rateDate}, the KSE-100 index is ${formatRate(rates.stock?.kse100Index)} points.`
  }

  return `I can help with Pakistan's gold prices, USD/PKR rates, petrol prices and KSE-100 market information. Please ask a specific question such as "What is today's gold price?"`
}

/* -------------------------------------------------------
   POST
------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const question = String(body?.question || '').trim()

    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : []

    /* ---------------------------------------------------
       VALIDATION
    --------------------------------------------------- */

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a question.',
        },
        { status: 400 },
      )
    }

    if (question.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Question is too long.',
        },
        { status: 400 },
      )
    }

    /* ---------------------------------------------------
       GET LIVE DATA FROM PAYLOAD
    --------------------------------------------------- */

    const rates = await getDailyRates()

    const financeContext = buildFinanceContext(rates)

    /* ---------------------------------------------------
       GEMINI CONFIG
    --------------------------------------------------- */

    const apiKey = process.env.GEMINI_API_KEY

    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

    /* ---------------------------------------------------
       NO API KEY → LOCAL FALLBACK
    --------------------------------------------------- */

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing. Using local finance fallback.')

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, rates),
        source: rates?.source || 'Pakistan Finance live data',
        ai: false,
      })
    }

    /* ---------------------------------------------------
       PREVIOUS CHAT
    --------------------------------------------------- */

    const previousConversation = history
      .slice(-8)
      .map((message) => {
        const role = message.role === 'assistant' ? 'Assistant' : 'User'

        return `${role}: ${message.content}`
      })
      .join('\n')

    /* ---------------------------------------------------
       SYSTEM INSTRUCTIONS
    --------------------------------------------------- */

    const systemInstruction = `
You are the official Pakistan Finance Assistant.

You answer questions for the Pakistan Finance website.

Your primary purpose is to provide accurate and easy-to-understand
information about:

- Gold prices in Pakistan
- USD / PKR exchange rates
- Petrol prices
- KSE-100
- Pakistan financial markets
- Prize bonds
- Financial news and general financial concepts

IMPORTANT DATA RULES:

1. CURRENT FINANCE DATA below is the ONLY source of truth for current rates.

2. NEVER invent a gold price.

3. NEVER invent a USD/PKR rate.

4. NEVER invent a petrol price.

5. NEVER invent a KSE-100 value.

6. Always use the exact numbers supplied in CURRENT FINANCE DATA.

7. If a requested value says "Not available", clearly tell the user
   that the value is currently unavailable.

8. Always mention the date when answering a current-rate question.

9. Do not call old data "live" unless the supplied date is actually current.

10. Keep normal answers short: usually 1-3 sentences.

11. If the user asks specifically for a rate, answer the rate FIRST.
    Do not start with unnecessary explanations.

12. If the user asks for gold price, include both 24K and 22K when available.

13. If the user asks for USD/PKR, include both buying and selling rates
    when available.

14. If the user asks in Urdu or Roman Urdu, answer in the same language.

15. If the question is unrelated to Pakistan finance, politely explain
    that you are focused on Pakistan financial information.

16. For personalized investment advice, explain that the information
    is general and not personalized investment advice.

MOST IMPORTANT:

Never stop a rate answer halfway.

For example, do NOT answer:

"As per the latest available data..."

Instead provide the complete answer with the actual number.

${financeContext}

PREVIOUS CONVERSATION:
${previousConversation || 'No previous conversation.'}
`

    /* ---------------------------------------------------
       FINAL PROMPT
    --------------------------------------------------- */

    const prompt = `
${systemInstruction}

USER QUESTION:
${question}

Answer the user directly.

For a current rate question, give:
1. The exact rate.
2. The date.
3. The unit if applicable.

Keep the answer concise.
`

    /* ---------------------------------------------------
       GEMINI REQUEST
    --------------------------------------------------- */

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },

        body: JSON.stringify({
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
            temperature: 0.1,

            /*
             * Gemini 3 models support thinkingLevel.
             * Minimal is enough for a rate assistant and
             * keeps the response fast and focused.
             */
            thinkingConfig: {
              thinkingLevel: 'minimal',
            },

            /*
             * Enough room for normal assistant answers.
             */
            maxOutputTokens: 300,
          },
        }),
      },
    )

    /* ---------------------------------------------------
       GEMINI ERROR
    --------------------------------------------------- */

    if (!response.ok) {
      const errorText = await response.text()

      console.error('Gemini API error:', errorText)

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, rates),
        source: rates?.source || 'Pakistan Finance live data',
        ai: false,
      })
    }

    /* ---------------------------------------------------
       PARSE RESPONSE
    --------------------------------------------------- */

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

    /* ---------------------------------------------------
       DEBUG FINISH REASON
    --------------------------------------------------- */

    if (candidate?.finishReason) {
      console.log('Gemini finish reason:', candidate.finishReason)
    }

    /* ---------------------------------------------------
       EMPTY / INCOMPLETE RESPONSE
    --------------------------------------------------- */

    if (!answer) {
      console.warn('Gemini returned no usable answer. Using fallback.')

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer(question, rates),
        source: rates?.source || 'Pakistan Finance live data',
        ai: false,
      })
    }

    /* ---------------------------------------------------
       RETURN SUCCESS
    --------------------------------------------------- */

    return NextResponse.json({
      success: true,
      answer,
      source: rates?.source || 'Pakistan Finance',
      ai: true,
    })
  } catch (error) {
    console.error('Assistant API error:', error)

    /*
     * We don't want the assistant to completely break
     * because of an unexpected API/server problem.
     *
     * Try to get the latest rate data again and provide
     * the local answer if possible.
     */

    try {
      const rates = await getDailyRates()

      return NextResponse.json({
        success: true,
        answer: fallbackAnswer('financial information', rates),
        source: rates?.source || 'Pakistan Finance live data',
        ai: false,
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
