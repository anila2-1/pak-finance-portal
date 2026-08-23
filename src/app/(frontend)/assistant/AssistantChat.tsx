'use client'

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ArrowUp, Robot, User, CircleNotch } from '@phosphor-icons/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const quickQuestions = [
  "What's today's gold price?",
  'What is the USD / PKR rate?',
  "What's the latest petrol price?",
  'What is the KSE-100 index?',
]

const initialMessage: Message = {
  role: 'assistant',
  content:
    "Hello! I'm your HamarInfo Assistant. Ask me about gold prices, USD/PKR, petrol, KSE-100 or Pakistan's financial market.",
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [messages, loading])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`
  }, [question])

  async function sendQuestion(text?: string) {
    const value = (text ?? question).trim()
    if (!value || loading) return

    const userMessage: Message = {
      role: 'user',
      content: value,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setQuestion('')
    setLoading(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: value,
          history: messages,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to get assistant response.')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not generate an answer right now.',
      }

      setMessages((current) => [...current, assistantMessage])
    } catch (error) {
      console.error('Assistant chat error:', error)

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)

      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendQuestion()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendQuestion()
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* =====================================================
          CHAT HEADER
      ====================================================== */}
      <div className="shrink-0 border-b border-[#e7efed] bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f8f83] text-white shadow-sm">
                <Robot size={22} weight="duotone" />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#172326]">HamarInfo Assistant</h2>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-600">
                    Online • Ready to help
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <svg className="h-4 w-4 text-[#0f8f83]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.47L6.82 21 12 17.27 17.18 21l-.64-7.36L22 9.24l-7.19-.61L12 2z" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7c918d]">
                Pakistan HamariInfo Data
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHAT BODY
      ====================================================== */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          {/* MESSAGES */}
          <div className="flex flex-col gap-6">
            {messages.map((message, index) => {
              const isUser = message.role === 'user'

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[85%] items-start gap-2.5 sm:max-w-[75%] ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* AVATAR */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isUser
                          ? 'bg-[#172326] text-white'
                          : 'border border-[#cce8e3] bg-[#e8f7f4] text-[#0f8f83]'
                      }`}
                    >
                      {isUser ? (
                        <User size={15} weight="bold" />
                      ) : (
                        <Robot size={15} weight="duotone" />
                      )}
                    </div>

                    {/* MESSAGE */}
                    <div
                      className={
                        isUser
                          ? 'rounded-2xl rounded-tr-md bg-[#0f8f83] px-4 py-3 text-sm leading-7 text-white shadow-[0_4px_16px_rgba(15,143,131,0.18)]'
                          : 'rounded-2xl rounded-tl-md border border-[#dfeae8] bg-white px-4 py-3 text-sm leading-7 text-[#435552] shadow-[0_2px_12px_rgba(15,35,38,0.04)]'
                      }
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#cce8e3] bg-[#e8f7f4] text-[#0f8f83]">
                    <Robot size={15} weight="duotone" />
                  </div>

                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-[#dfeae8] bg-white px-4 py-3.5 shadow-sm">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0f8f83]" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0f8f83]"
                      style={{ animationDelay: '120ms' }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0f8f83]"
                      style={{ animationDelay: '240ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK QUESTIONS */}
          {messages.length <= 1 && (
            <div className="mt-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9c99]">
                Quick questions
              </p>

              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={loading}
                    onClick={() => sendQuestion(item)}
                    className="shrink-0 rounded-full border border-[#d7e7e4] bg-white px-4 py-2.5 text-xs font-medium text-[#49615d] transition hover:border-[#9dd2ca] hover:bg-[#f0faf8] hover:text-[#0f8f83] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          MESSAGE COMPOSER
      ====================================================== */}
      <div className="shrink-0 border-t border-[#e5efed] bg-white px-4 py-4 sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end rounded-2xl border border-[#d7e5e2] bg-[#fbfdfc] p-2 shadow-[0_4px_20px_rgba(15,35,38,0.05)] transition focus-within:border-[#8fcfc6] focus-within:ring-4 focus-within:ring-[#0f8f83]/5">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              maxLength={1000}
              placeholder="Ask about gold, USD/PKR, petrol or KSE-100..."
              className="min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 pr-12 text-sm text-[#263a37] outline-none placeholder:text-[#9aaba8] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!question.trim() || loading}
              aria-label="Send message"
              className="absolute bottom-1.5 right-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f8f83] text-white transition hover:bg-[#08786e] disabled:cursor-not-allowed disabled:bg-[#a8d8d2]"
            >
              {loading ? (
                <CircleNotch size={19} weight="bold" className="animate-spin" />
              ) : (
                <ArrowUp size={18} weight="bold" />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[9px] text-[#9aaba8]">
              Press Enter to send • Shift + Enter for new line
            </p>

            <p className="hidden text-[9px] text-[#9aaba8] sm:block">
              HamariInfo is for general informational purposes.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
