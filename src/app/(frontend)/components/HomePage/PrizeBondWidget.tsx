import Link from 'next/link'
import {
  ArrowRight,
  MagnifyingGlass,
  Ticket,
  Trophy,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr'

interface PrizeBondWidgetProps {
  draws: any[]
}

export default function PrizeBondWidget({ draws }: PrizeBondWidgetProps) {
  const latestDraw = draws?.[0]

  return (
    <section className="group overflow-hidden rounded-[28px] border border-[#d8ebe7] bg-white shadow-[0_10px_35px_rgba(15,143,131,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(15,143,131,0.11)]">
      {/* HEADER */}
      <div className="relative overflow-hidden border-b border-[#e5f0ee] bg-gradient-to-br from-[#effaf7] via-white to-[#f7fcfb] px-6 py-6">
        {/* Decorative shape */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#d9f3ed]/70 blur-2xl" />

        <div className="relative flex items-start gap-3.5">
          {/* Icon */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#dff5ef] text-[#0f8f83] ring-1 ring-[#c9ebe4] transition-transform duration-300 group-hover:scale-105">
            <Ticket size={22} weight="duotone" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#0f8f83] shadow-[0_0_0_4px_rgba(15,143,131,0.10)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f8f83]">
                Prize Bonds
              </p>
            </div>

            <h2 className="mt-1 text-[21px] font-bold tracking-tight text-[#172326]">
              Check Your Bond
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#687b7d]">
              Search prize bond results quickly.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="p-6">
        <form action="/prize-bonds" className="space-y-4">
          {/* DENOMINATION */}
          <div>
            <label
              htmlFor="denomination"
              className="mb-2 block text-[12px] font-bold text-[#344548]"
            >
              Denomination
            </label>

            <div className="relative">
              <select
                id="denomination"
                name="denomination"
                defaultValue=""
                className="h-11 w-full appearance-none rounded-xl border border-[#d9e8e5] bg-[#f8fbfa] px-3.5 pr-10 text-[13px] font-medium text-[#263638] outline-none transition-all duration-200 hover:border-[#b9dcd6] focus:border-[#0f8f83] focus:bg-white focus:ring-4 focus:ring-[#0f8f83]/10"
              >
                <option value="">Select denomination</option>
                <option value="100">Rs. 100</option>
                <option value="200">Rs. 200</option>
                <option value="750">Rs. 750</option>
                <option value="1500">Rs. 1,500</option>
                <option value="7500">Rs. 7,500</option>
                <option value="15000">Rs. 15,000</option>
                <option value="25000">Rs. 25,000</option>
                <option value="40000">Rs. 40,000</option>
              </select>

              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78908d]">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* BOND NUMBER */}
          <div>
            <label htmlFor="number" className="mb-2 block text-[12px] font-bold text-[#344548]">
              Bond Number
            </label>

            <div className="relative">
              <MagnifyingGlass
                size={17}
                weight="regular"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829694]"
              />

              <input
                id="number"
                name="number"
                type="text"
                inputMode="numeric"
                placeholder="Enter bond number"
                className="h-11 w-full rounded-xl border border-[#d9e8e5] bg-[#f8fbfa] pl-10 pr-3.5 text-[13px] font-medium text-[#263638] outline-none transition-all duration-200 placeholder:text-[#9aa9a8] hover:border-[#b9dcd6] focus:border-[#0f8f83] focus:bg-white focus:ring-4 focus:ring-[#0f8f83]/10"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="group/button flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f8f83] px-4 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(15,143,131,0.18)] transition-all duration-200 hover:bg-[#08776d] hover:shadow-[0_8px_22px_rgba(15,143,131,0.24)] active:scale-[0.985]"
          >
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="transition-transform duration-200 group-hover/button:scale-110"
            />
            Check Bond
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform duration-200 group-hover/button:translate-x-1"
            />
          </button>
        </form>

        {/* LATEST DRAW */}
        {latestDraw && (
          <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#cfece5] bg-gradient-to-br from-[#effaf7] to-[#f8fcfb] p-4">
            <div className="absolute -right-5 -top-5 size-20 rounded-full bg-[#d9f3ed]/70 blur-xl" />

            <div className="relative flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0f8f83] shadow-sm ring-1 ring-[#dceeea]">
                <Trophy size={18} weight="duotone" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Sparkle size={11} weight="fill" className="text-[#0f8f83]" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                    Latest Draw
                  </p>
                </div>

                <p className="mt-0.5 truncate text-[13px] font-bold text-[#172326]">
                  Draw #{latestDraw.drawNumber}
                </p>

                {latestDraw.denomination && (
                  <p className="mt-0.5 text-[11px] text-[#718382]">
                    Rs. {Number(latestDraw.denomination).toLocaleString('en-PK')}
                  </p>
                )}
              </div>

              <div className="hidden size-7 items-center justify-center rounded-lg bg-white text-[#0f8f83] shadow-sm sm:flex">
                <ArrowRight size={14} weight="bold" />
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE LINK */}
        <Link
          href="/prize-bonds"
          className="group/link mt-5 flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#607371] transition-colors duration-200 hover:text-[#0f8f83]"
        >
          View Draw Schedule
          <ArrowRight
            size={14}
            weight="bold"
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </section>
  )
}
