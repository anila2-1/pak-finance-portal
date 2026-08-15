import type { Metadata } from 'next'
import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { ChatCircle, EnvelopeSimple, PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Pakistan Finance for questions, feedback, corrections and general inquiries.',
}

export default async function ContactPage() {
  const siteSettings = (await getSiteSettings()) as { siteName?: string } | null
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
                Get In Touch
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#172326] sm:text-4xl lg:text-5xl">
                Contact Us
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#647477] sm:text-base">
                Have a question, correction, suggestion or feedback? Get in touch with the{' '}
                {siteName} team.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT AREA */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            {/* LEFT */}
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_8px_35px_rgba(15,143,131,0.06)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f7f3] text-[#0f8f83]">
                  <ChatCircle size={24} weight="duotone" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#172326]">
                  We&apos;d love to hear from you
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#647477]">
                  If you have feedback about our financial information, discover an incorrect rate,
                  want to suggest an improvement, or simply have a question, send us a message.
                </p>
              </div>

              <div className="rounded-3xl border border-[#cfe7e2] bg-[#f3fbf9] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f8f83] text-white">
                    <EnvelopeSimple size={20} weight="duotone" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#172326]">General Inquiries</p>

                    <p className="mt-1 text-xs text-[#647477]">
                      Use the contact form to send your message.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_8px_35px_rgba(15,143,131,0.06)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f8f83]">
                  Send Message
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#172326]">How can we help?</h2>

                <p className="mt-2 text-sm leading-6 text-[#647477]">
                  Fill out the form below and send us your inquiry.
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-[#344447]"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-xl border border-[#dce9e5] bg-[#f8faf9] px-4 text-sm text-[#172326] outline-none transition focus:border-[#0f8f83] focus:bg-white focus:ring-4 focus:ring-[#0f8f83]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-[#344447]"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-[#dce9e5] bg-[#f8faf9] px-4 text-sm text-[#172326] outline-none transition focus:border-[#0f8f83] focus:bg-white focus:ring-4 focus:ring-[#0f8f83]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-[#344447]"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="What is your message about?"
                    className="h-12 w-full rounded-xl border border-[#dce9e5] bg-[#f8faf9] px-4 text-sm text-[#172326] outline-none transition focus:border-[#0f8f83] focus:bg-white focus:ring-4 focus:ring-[#0f8f83]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-[#344447]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-[#dce9e5] bg-[#f8faf9] px-4 py-3 text-sm leading-6 text-[#172326] outline-none transition focus:border-[#0f8f83] focus:bg-white focus:ring-4 focus:ring-[#0f8f83]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f8f83] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,143,131,0.18)] transition hover:-translate-y-0.5 hover:bg-[#087f73] hover:shadow-[0_12px_25px_rgba(15,143,131,0.22)]"
                >
                  Send Message
                  <PaperPlaneTilt size={17} weight="bold" />
                </button>

                <p className="text-center text-[11px] leading-5 text-[#8a989a]">
                  Please do not submit passwords, payment information or other sensitive personal
                  information.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
