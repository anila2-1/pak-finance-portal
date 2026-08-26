import type { Metadata } from 'next'
import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getCategories } from '@/lib/getCategories'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Privacy Policy of Pakistan HamariInfo to understand how we collect, use and protect information.',
}

export default async function PrivacyPolicyPage() {
  const siteSettings = (await getSiteSettings()) as { siteName?: string } | null
  const siteName = siteSettings?.siteName || 'HamariInfo'

  const [categoriesResult] = await Promise.all([
    getCategories({ limit: 50 }),
  ])

  const categories = categoriesResult.docs

  return (
    <div className="min-h-screen bg-[#f4f8f76e]">
      <Header siteSettings={siteSettings} categories={categories || []} />

      <main>
        {/* HERO */}
        <section className="border-b border-[#dce9e5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0f8f83]">
                Legal Information
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#172326] sm:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#647477] sm:text-base">
                This Privacy Policy explains how {siteName} collects, uses and protects information
                when you use our website.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <article className="rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_8px_35px_rgba(15,143,131,0.06)] sm:p-8 lg:p-10">
            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-bold text-[#172326]">1. Introduction</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Welcome to {siteName}. We respect your privacy and are committed to protecting the
                  information you provide while using our website.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  By using this website, you agree to the practices described in this Privacy
                  Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">2. Information We Collect</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  We may collect information that you voluntarily provide when using features of the
                  website, such as contact forms or other interactive features.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  We may also automatically receive limited technical information such as browser
                  type, device information, pages visited and general usage information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">3. How We Use Information</h2>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-[#647477]">
                  <li>• To operate and maintain our website.</li>
                  <li>• To improve website functionality and user experience.</li>
                  <li>• To understand how visitors use our website.</li>
                  <li>• To respond to inquiries and requests.</li>
                  <li>• To protect the security and integrity of the website.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">4. Cookies</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Our website may use cookies and similar technologies to improve functionality,
                  understand website usage and provide relevant experiences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">5. Google Analytics</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  If Google Analytics is enabled on the website, it may collect information about
                  website usage, including pages visited, approximate location, device information
                  and other analytics data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">6. Google AdSense</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  If Google AdSense is enabled, third-party advertising providers may use cookies or
                  similar technologies to display advertisements based on visits to this and other
                  websites.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">7. Third-Party Services</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  Our website may use third-party services for analytics, advertising, hosting,
                  security or other website functions. These services may process information
                  according to their own privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">8. Data Security</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  We take reasonable measures to protect information handled through our website.
                  However, no internet transmission or electronic storage system can be guaranteed
                  to be completely secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#172326]">9. Changes to This Policy</h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  We may update this Privacy Policy from time to time. Any changes will be published
                  on this page.
                </p>
              </section>

              <section className="rounded-2xl border border-[#cfe7e2] bg-[#f3fbf9] p-5">
                <h2 className="text-lg font-bold text-[#172326]">Questions About Privacy?</h2>

                <p className="mt-2 text-sm leading-6 text-[#647477]">
                  If you have questions about this Privacy Policy, please visit our Contact Us page.
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
