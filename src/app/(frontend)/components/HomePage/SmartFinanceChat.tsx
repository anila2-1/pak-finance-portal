'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Robot, X } from '@phosphor-icons/react'

export default function SmartAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  const quickQuestions = [
    {
      label: "Today's gold price",
      query: 'gold-price',
    },
    {
      label: 'USD / PKR rate',
      query: 'currency',
    },
    {
      label: 'Prize bond information',
      query: 'prize-bonds',
    },
  ]

  return (
    <>
      {/* =====================================================
          FLOATING AI BUTTON
      ====================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Financial Assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe5e1] bg-white text-[#0f8f83] shadow-[0_8px_30px_rgba(15,143,131,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#0f8f83] hover:text-white sm:bottom-7 sm:right-7"
      >
        <Robot size={25} weight="duotone" />

        {/* Online indicator */}
        <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      </button>

      {/* =====================================================
          BACKDROP
      ====================================================== */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close assistant"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-[2px]"
        />
      )}

      {/* =====================================================
          AI CHAT PREVIEW PANEL
      ====================================================== */}
      <aside
        className={`fixed right-3 top-3 bottom-3 z-[70] flex w-[380px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] transition-all duration-300 sm:right-4 sm:top-4 sm:bottom-4 sm:max-w-[calc(100vw-2rem)] ${
          isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-[110%] opacity-0'
        }`}
      >
        {/* =================================================
            HEADER
        ================================================== */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#f4fbfa] to-white px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f8f83] text-white">
              <Robot size={21} weight="duotone" />

              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">Financial Assistant</p>

              <p className="text-[11px] text-emerald-600">Online • Ready to help</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            CONTENT
        ================================================== */}
        <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto bg-slate-50/60">
          <div className="p-4 sm:p-5">
            {/* INTRO MESSAGE */}
            <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-sm leading-6 text-slate-700">Hello! 👋</p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                I&apos;m your Pakistan Finance Assistant. Ask me about financial rates, gold prices,
                currency, prize bonds or the Pakistani financial market.
              </p>
            </div>

            {/* QUICK QUESTIONS */}
            <div className="mt-5">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Quick questions
              </p>

              <div className="space-y-2">
                {quickQuestions.map((item) => (
                  <Link
                    key={item.query}
                    href={`/assistant?query=${item.query}`}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium text-slate-700 transition-all duration-200 hover:border-[#b9ddd8] hover:bg-[#f3fbf9] hover:text-[#0f8f83]"
                  >
                    <span>{item.label}</span>

                    <ArrowUpRight
                      size={15}
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f8f83]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================== */}
          <div className="shrink-0 border-t border-slate-200 bg-white p-4">
            <Link
              href="/assistant"
              onClick={() => setIsOpen(false)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-[#0f8f83]"
            >
              Open Financial Assistant
              <ArrowUpRight size={16} weight="bold" />
            </Link>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              Get detailed answers from the full assistant
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
