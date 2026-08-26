import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  ChartLineUp,
  CheckCircle,
  Coins,
  CurrencyCircleDollar,
  ShieldCheck,
  TrendUp,
} from '@phosphor-icons/react/dist/ssr'

import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getCategories } from '@/lib/getCategories'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSiteSettings()) ?? {}

  const siteName = (settings as any).siteName || 'HamariInfo'

  return {
    title: `About Us | ${siteName}`,
    description:
      'Learn more about Pakistan HamariInfo, a HamariInfo portal providing Pakistan gold prices, currency rates, petrol prices, prize bond information and market updates.',
    alternates: {
      canonical: '/about-us',
    },
    // robots: {
    //   index: true,
    //   follow: true,
    // },
    openGraph: {
      title: `About Us | ${siteName}`,
      description: 'Learn more about Pakistan HamariInfo and the HamariInfo we provide.',
      type: 'website',
      url: '/about-us',
    },
  }
}

export default async function AboutUsPage() {
  const siteSettings = (await getSiteSettings()) as {
    siteName?: string
    siteDescription?: string
  } | null

  const siteName = siteSettings?.siteName || 'HamariInfo'

  const siteDescription =
    (siteSettings as any).siteDescription ||
    'Stay informed with real-time market rates, latest government scheme guides, tech updates, and daily informative articles.'

  const [categoriesResult] = await Promise.all([
    getCategories({ limit: 50 }),
  ])

  const categories = categoriesResult.docs

  return (
    <div className="min-h-screen bg-[#f4f8f76e] text-[#172326]">
      {/* HEADER */}
      <Header siteSettings={siteSettings} categories={categories || []} />

      <main>
        {/* HERO */}
        <section className="border-b border-[#dce9e5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe5e1] bg-[#f1faf8] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#087f73]">
                <ShieldCheck size={15} weight="duotone" />
                About {siteName}
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#172326] sm:text-4xl lg:text-5xl">
                Reliable HamariInfo for Pakistan
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#647477] sm:text-base">
                {siteDescription}
              </p>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                Who We Are
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#172326] sm:text-3xl">
                Your source for Pakistan financial updates
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-[#647477] sm:text-base">
                <p>
                  <strong className="font-semibold text-[#172326]">{siteName}</strong> is a
                  financial information platform focused on making important financial information
                  easier to find and understand.
                </p>

                <p>
                  We bring together information such as gold prices, currency exchange rates, petrol
                  prices, prize bond information and Pakistan market updates in one convenient
                  place.
                </p>

                <p>
                  Our goal is to provide clear, accessible and useful financial information for
                  people who want to stay informed about Pakistan&apos;s financial environment.
                </p>
              </div>
            </div>

            {/* HIGHLIGHT CARD */}
            <div className="rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_12px_40px_rgba(15,143,131,0.07)] sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f7f3] text-[#087f73]">
                <ChartLineUp size={25} weight="duotone" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#172326]">
                Built for better financial awareness
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#647477]">
                We focus on presenting financial information in a simple, readable and accessible
                format so visitors can quickly find the information they need.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Pakistan-focused financial information',
                  'Simple and easy-to-understand presentation',
                  'Regular financial and market updates',
                  'Useful information collected in one place',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-[#46565a]">
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-[#0f8f83]"
                    />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE COVER */}
        <section className="border-y border-[#dce9e5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8f83]">
                What We Cover
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#172326] sm:text-3xl">
                Financial information that matters
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#647477]">
                Explore key areas of Pakistan&apos;s financial information through our platform.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Gold Prices',
                  description: 'Information about gold rates, including 24K and 22K gold prices.',
                  icon: Coins,
                },
                {
                  title: 'Currency Rates',
                  description: 'Pakistan currency exchange information including USD/PKR.',
                  icon: CurrencyCircleDollar,
                },
                {
                  title: 'Market Updates',
                  description:
                    'Information related to Pakistan financial and stock market activity.',
                  icon: TrendUp,
                },
                {
                  title: 'Prize Bonds',
                  description: 'Useful information about prize bonds and related updates.',
                  icon: ShieldCheck,
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-[#dce9e5] bg-[#f9fcfb] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#b9ddd8] hover:bg-white hover:shadow-[0_12px_30px_rgba(15,143,131,0.08)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f7f3] text-[#087f73] transition-colors group-hover:bg-[#087f73] group-hover:text-white">
                      <Icon size={22} weight="duotone" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-[#172326]">{item.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-[#6b7a7c]">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* OUR APPROACH */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-3xl border border-[#dce9e5] bg-[#eff9f7] p-7 sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#087f73]">
                  Our Approach
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#172326] sm:text-3xl">
                  Clear information. Simple experience.
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#647477] sm:text-base">
                  Financial information can sometimes be difficult to find or understand. We aim to
                  make the experience simpler by organizing important information into clear
                  sections and presenting it in an easy-to-read format.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Easy to navigate',
                  'Pakistan focused',
                  'Information driven',
                  'User friendly',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[#cfe5e1] bg-white px-4 py-4"
                  >
                    <CheckCircle size={20} weight="fill" className="text-[#0f8f83]" />

                    <span className="text-sm font-semibold text-[#405250]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DISCLAIMER / CTA */}
        <section className="border-t border-[#dce9e5] bg-white">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f7f3] text-[#087f73]">
              <ShieldCheck size={25} weight="duotone" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#172326]">
              Financial information for general awareness
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#647477]">
              The information provided through {siteName} is intended for general informational and
              educational purposes. It should not be considered personalized financial, investment
              or legal advice. Always verify important financial information with appropriate
              official or professional sources before making financial decisions.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/posts"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#087f73] px-5 text-sm font-semibold text-white transition hover:bg-[#066c62]"
              >
                Explore Latest Posts
                <ArrowRight size={16} weight="bold" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#cfe5e1] bg-white px-5 text-sm font-semibold text-[#405250] transition hover:border-[#087f73] hover:text-[#087f73]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer siteSettings={siteSettings} />
    </div>
  )
}
