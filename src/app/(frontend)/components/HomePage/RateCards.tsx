interface RateCardsProps {
  rates: any
}

export default function RateCards({ rates }: RateCardsProps) {
  const cards = [
    {
      label: 'Gold 24K',
      value: rates?.gold?.gold24k ? `Rs. ${Number(rates.gold.gold24k).toLocaleString()}` : '—',
      description: 'Per tola',
      icon: 'Au',
      accent: 'gold',
    },
    {
      label: 'USD / PKR',
      value: rates?.currency?.usdBuying
        ? `Rs. ${Number(rates.currency.usdBuying).toLocaleString()}`
        : '—',
      description: 'Buying rate',
      icon: '$',
      accent: 'currency',
    },
    {
      label: 'Petrol',
      value: rates?.fuel?.petrol ? `Rs. ${Number(rates.fuel.petrol).toLocaleString()}` : '—',
      description: 'Per litre',
      icon: 'P',
      accent: 'fuel',
    },
    {
      label: 'KSE-100',
      value: rates?.stock?.kse100Index ? Number(rates.stock.kse100Index).toLocaleString() : '—',
      description: 'Market index',
      icon: 'K',
      accent: 'stock',
      change: rates?.stock?.kse100Change,
    },
  ]

  return (
    <section className="border-b border-[#dcfff5] bg-[#f6f6f6]">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        {/* LIVE HEADER */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0f8f83] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#cf0808]" />
            </span>

            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#cc0707]">
              Live Market Rates
            </span>
          </div>

          {rates?.source && (
            <div className="hidden items-center gap-1.5 text-[11px] sm:flex">
              <span className="text-[#656d6b]">Source</span>
              <span className="font-medium text-[#021d1a]">{rates.source}</span>
            </div>
          )}
        </div>

        {/* RATE CARDS */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="
                group relative flex min-h-20.5 items-center
                justify-between overflow-hidden rounded-xl
                border border-[#e0e8e6]
                bg-white
                px-3.5 py-3
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-[#b9d9d5]
                hover:shadow-[0_6px_20px_rgba(15,143,131,0.08)]
                sm:px-4
              "
            >
              {/* Small accent line */}
              <span
                className={`
                  absolute left-0 top-0 h-full w-0.75
                  ${
                    card.accent === 'gold'
                      ? 'bg-amber-400'
                      : card.accent === 'currency'
                        ? 'bg-blue-500'
                        : card.accent === 'fuel'
                          ? 'bg-orange-500'
                          : 'bg-[#0f8f83]'
                  }
                `}
              />

              <div className="min-w-0 pl-1">
                {/* LABEL */}
                <div className="mb-1 flex items-center gap-1.5">
                  <p className="truncate text-[11px] font-semibold text-[#687976]">{card.label}</p>

                  <span className="hidden text-[9px] text-[#a0aaa8] sm:inline">
                    {card.description}
                  </span>
                </div>

                {/* VALUE */}
                <div className="flex items-baseline gap-1.5">
                  <p className="truncate text-[16px] font-bold tracking-tight text-[#172326] sm:text-[17px]">
                    {card.value}
                  </p>

                  {typeof card.change === 'number' && (
                    <span
                      className={`whitespace-nowrap text-[9px] font-bold ${
                        card.change >= 0 ? 'text-[#168052]' : 'text-[#d94a4a]'
                      }`}
                    >
                      {card.change >= 0 ? `▲ ${card.change}` : `▼ ${Math.abs(card.change)}`}
                    </span>
                  )}
                </div>

                {/* MOBILE DESCRIPTION */}
                <p className="mt-0.5 text-[9px] text-[#98a3a1] sm:hidden">{card.description}</p>
              </div>

              {/* ICON */}
              <span
                className={`
                  ml-2 flex h-8 w-8 shrink-0 items-center
                  justify-center rounded-lg border
                  text-[10px] font-bold
                  ${
                    card.accent === 'gold'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : card.accent === 'currency'
                        ? 'border-blue-100 bg-blue-50 text-blue-600'
                        : card.accent === 'fuel'
                          ? 'border-orange-100 bg-orange-50 text-orange-600'
                          : 'border-[#cce5e1] bg-[#eef9f7] text-[#0f8f83]'
                  }
                `}
              >
                {card.icon}
              </span>
            </div>
          ))}
        </div>

        {/* NOTE */}
        {rates?.notes && <p className="mt-2 text-[9px] text-[#98a3a1]">* {rates.notes}</p>}
      </div>
    </section>
  )
}
