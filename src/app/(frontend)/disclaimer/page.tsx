import type { Metadata } from 'next'
import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the financial information disclaimer for Pakistan Finance.',
}

export default async function DisclaimerPage() {
  const siteSettings = (await getSiteSettings()) ?? {}
  const siteName = siteSettings?.siteName || 'Pakistan Finance'

  return (
    <div className="min-h-screen bg-[#f4f8f76e]">
      <Header siteSettings={siteSettings} />

      <main>
        {/* HERO */}
        <section className="border-b border-[#dce9e5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0f8f83]">
                Important Information
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#172326] sm:text-4xl lg:text-5xl">
                Disclaimer
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#647477] sm:text-base">
                Important information about the financial data, rates, market information and
                content published on {siteName}.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <article className="rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_8px_35px_rgba(15,143,131,0.06)] sm:p-8 lg:p-10">
            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-bold text-[#172326]">1. General Information</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  The information provided on {siteName} is intended for general informational and
                  educational purposes only.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  While we make reasonable efforts to provide useful and accurate information, we do
                  not guarantee that all information is complete, current or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">2. Financial Information</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Gold prices, currency rates, fuel prices, stock market data, prize bond
                  information and other financial figures may change frequently.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Information displayed on this website may be based on available sources and may
                  not represent real-time market prices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">3. No Investment Advice</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Nothing published on this website should be considered personalized financial,
                  investment, trading, tax or legal advice.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  You should conduct your own research and consult a qualified professional before
                  making financial decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">4. External Sources</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Some information may originate from third-party sources. We are not responsible
                  for inaccuracies, changes or interruptions originating from external sources.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">5. External Links</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Our website may contain links to external websites. We do not control those
                  websites and are not responsible for their content, availability or privacy
                  practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">6. Prize Bond Information</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Prize bond information, schedules and results are provided for general
                  informational purposes. Users should verify official results and announcements
                  through the relevant official authorities before relying on them.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">7. Limitation of Liability</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  {siteName} shall not be responsible for any loss or damage resulting from reliance
                  on information published on this website.
                </p>
              </section>

              <section className="rounded-2xl border border-[#cfe7e2] bg-[#f3fbf9] p-5">
                <h2 className="text-lg font-bold text-[#172326]">Important Reminder</h2>

                <p className="mt-2 text-sm leading-6 text-[#647477]">
                  Always verify important financial information with an appropriate official or
                  professional source before making financial decisions.
                </p>
              </section>
            </div>
          </article>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
