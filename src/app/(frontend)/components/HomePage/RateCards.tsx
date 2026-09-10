import React from 'react'
import { Coins, DollarSign, Fuel, Sparkles, TrendingUp } from 'lucide-react'

interface RateCardsProps {
  rates: any
}

function formatNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return String(value)
  }

  return number.toLocaleString('en-PK')
}

// Mini SVG Sparkline Component
function SparklineChart({ isUp }: { isUp: boolean }) {
  return (
    <svg className="h-4 w-9 sm:h-5 sm:w-12 stroke-2 fill-none shrink-0" viewBox="0 0 48 20">
      <path
        d={isUp ? 'M2 16 L14 12 L26 14 L38 4 L46 6' : 'M2 4 L14 8 L26 6 L38 16 L46 14'}
        className={isUp ? 'stroke-emerald-500' : 'stroke-rose-500'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function RateCards({ rates }: RateCardsProps) {
  const cards = [
    {
      title: 'Gold',
      icon: Coins,
      accent: 'gold',
      items: [
        { label: '24K Gold', value: rates?.gold?.gold24k, unit: 'Per tola', trend: 'up' },
        { label: '22K Gold', value: rates?.gold?.gold22k, unit: 'Per tola', trend: 'up' },
        { label: '21K Gold', value: rates?.gold?.gold21k, unit: 'Per tola', trend: 'neutral' },
      ],
    },
    {
      title: 'Currency',
      icon: DollarSign,
      accent: 'currency',
      items: [
        { label: 'USD / PKR', value: rates?.currency?.usdBuying, unit: 'Buying', trend: 'up' },
        { label: 'AED / PKR', value: rates?.currency?.aedRate, unit: '1 AED', trend: 'down' },
        { label: 'SAR / PKR', value: rates?.currency?.sarRate, unit: '1 SAR', trend: 'neutral' },
      ],
    },
    {
      title: 'Fuel',
      icon: Fuel,
      accent: 'fuel',
      items: [
        { label: 'Petrol', value: rates?.fuel?.petrol, unit: 'Per litre', trend: 'up' },
        {
          label: 'High Speed Diesel',
          value: rates?.fuel?.highSpeedDiesel,
          unit: 'Per litre',
          trend: 'down',
        },
        {
          label: 'Kerosene Oil',
          value: rates?.fuel?.keroseneOil,
          unit: 'Per litre',
          trend: 'neutral',
        },
      ],
    },
    {
      title: 'Silver',
      icon: Sparkles,
      accent: 'silver',
      items: [
        { label: 'Silver', value: rates?.silver?.silverPerTola, unit: 'Per tola', trend: 'up' },
        { label: 'Silver', value: rates?.silver?.silverPer10g, unit: 'Per 10g', trend: 'neutral' },
        { label: 'Silver', value: rates?.silver?.silverPerGram, unit: 'Per Gram', trend: 'local' },
      ],
    },
  ]

  const formattedDate = rates?.lastVerifiedAt
    ? new Date(rates.lastVerifiedAt).toLocaleString('en-PK', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Karachi',
      })
    : 'Recently Updated'

  return (
    <section className="bg-linear-to-b from-[#f8faf9] to-[#edf3f1] py-2 sm:py-4 border-b border-emerald-100/60">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6">
        {/* HEADER */}
        <div className="mb-3 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-6">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-600" />
            </span>
            <span className="text-[11px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-red-600">
              Live Market Rates
            </span>
          </div>

          {rates?.source && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 sm:py-1 rounded-full border border-slate-200/60 shadow-2xs">
              <span className="font-normal text-slate-400">Source:</span>
              <span className="font-semibold text-slate-700">{rates.source}</span>
            </div>
          )}
        </div>

        {/* RATE CARDS GRID (Mobile: 2 columns, Desktop: 4 columns) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
          {cards.map((card) => {
            const IconComponent = card.icon
            return (
              <div
                key={card.title}
                className="
                  group relative overflow-hidden rounded-xl sm:rounded-2xl
                  bg-white p-3 sm:p-5
                  border border-slate-200/80
                  shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] sm:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(15,143,131,0.12)]
                  hover:border-emerald-300/60
                "
              >
                {/* ACCENT BAR */}
                <span
                  className={`
                    absolute top-0 left-0 right-0 h-1 sm:h-1.5
                    ${
                      card.accent === 'gold'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                        : card.accent === 'currency'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          : card.accent === 'fuel'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }
                  `}
                />

                {/* CARD HEADER WITH ICON & SPARKLINE */}
                <div className="flex items-center justify-between pb-2 sm:pb-4 mb-2 sm:mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                    <span
                      className={`
                        flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl shadow-2xs
                        ${
                          card.accent === 'gold'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                            : card.accent === 'currency'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                              : card.accent === 'fuel'
                                ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                        }
                      `}
                    >
                      <IconComponent className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    </span>
                    <h3 className="text-xs sm:text-base font-bold text-slate-800 tracking-tight truncate">
                      {card.title}
                    </h3>
                  </div>

                  {/* HEADER TREND SPARKLINE */}
                  <SparklineChart isUp={card.accent !== 'currency'} />
                </div>

                {/* ITEMS LIST */}
                <div className="space-y-2 sm:space-y-4">
                  {card.items.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[11px] sm:text-xs font-semibold text-slate-700">
                          {item.label}
                        </p>
                        <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium leading-none sm:leading-normal">
                          {item.unit}
                        </p>
                      </div>

                      <div className="text-left sm:text-right mt-0.5 sm:mt-0">
                        <p className="shrink-0 text-xs sm:text-base font-bold tracking-tight text-slate-900">
                          {item.value !== undefined && item.value !== null && item.value !== ''
                            ? `Rs. ${formatNumber(item.value)}`
                            : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* BOTTOM GLOBAL FOOTER */}
        {(rates?.lastVerifiedAt || rates?.notes) && (
          <div className="mt-3 sm:mt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-1">
            {rates?.lastVerifiedAt && (
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Verified On:{' '}
                <span className="text-slate-600 font-semibold">
                  {new Date(rates.lastVerifiedAt).toLocaleString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: 'Asia/Karachi',
                  })}
                </span>
              </p>
            )}

            {rates?.notes && (
              <p className="text-[10px] sm:text-xs font-medium text-slate-400 italic">
                * {rates.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
