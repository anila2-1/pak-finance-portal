'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowUpRight,
  FacebookLogo,
  InstagramLogo,
  TelegramLogo,
  YoutubeLogo,
  WhatsappLogo,
} from '@phosphor-icons/react/dist/ssr'

interface FooterProps {
  siteSettings?: any
}

interface SiteSettingsData {
  siteName?: string
  name?: string
  siteDescription?: string
  logo?: {
    url?: string
    alt?: string
  }
  socialMedia?: {
    whatsapp?: string
    telegram?: string
    facebook?: string
    instagram?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
}

export default function Footer({ siteSettings }: FooterProps) {
  const [settings, setSettings] = useState<SiteSettingsData | null>(siteSettings || null)
  const [loading, setLoading] = useState(!siteSettings)

  useEffect(() => {
    if (siteSettings) return

    let isMounted = true

    async function loadSettings() {
      try {
        const response = await fetch('/api/site-settings', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch site settings')
        }

        const json = await response.json()

        if (isMounted && json?.success && json.data) {
          setSettings(json.data)
        }
      } catch (error) {
        console.error('Failed to load site settings in Footer:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      isMounted = false
    }
  }, [siteSettings])

  const currentSettings = settings || {}

  const siteName = currentSettings.siteName || currentSettings.name || 'Pakistan Finance'

  const siteDescription =
    currentSettings.siteDescription || "Pakistan's trusted financial information portal."

  const logo = typeof currentSettings.logo === 'object' ? currentSettings.logo : null

  const social = currentSettings.socialMedia || {}

  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: social.whatsapp,
      icon: WhatsappLogo,
    },
    {
      name: 'Telegram',
      href: social.telegram,
      icon: TelegramLogo,
    },
    {
      name: 'Facebook',
      href: social.facebook,
      icon: FacebookLogo,
    },
    {
      name: 'Instagram',
      href: social.instagram,
      icon: InstagramLogo,
    },
    {
      name: 'YouTube',
      href: social.youtube,
      icon: YoutubeLogo,
    },
  ].filter((item) => item.href)

  return (
    <footer className="border-t border-[#dceae7] bg-white text-[#172326]">
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* BRAND */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              {logo?.url ? (
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
                  <Image
                    src={logo.url}
                    alt={logo.alt || siteName}
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f8f83] text-white shadow-sm">
                  <span className="text-lg font-bold">PF</span>
                </span>
              )}

              <span className="text-xl font-bold tracking-tight text-[#172326]">{siteName}</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#647477]">{siteDescription}</p>

            {/* SOCIAL MEDIA */}
            {!loading && socialLinks.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#172326]">
                  Follow Us
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map((socialItem) => {
                    const Icon = socialItem.icon

                    const socialStyles: Record<string, string> = {
                      Facebook:
                        'text-[#1877F2] border-[#dbe8ff] bg-[#f4f7ff] hover:bg-[#1877F2] hover:border-[#1877F2]',
                      Instagram:
                        'text-[#E4405F] border-[#f8dce4] bg-[#fff6f8] hover:bg-[#E4405F] hover:border-[#E4405F]',
                      YouTube:
                        'text-[#FF0000] border-[#ffdada] bg-[#fff5f5] hover:bg-[#FF0000] hover:border-[#FF0000]',
                      WhatsApp:
                        'text-[#25D366] border-[#d7f5e1] bg-[#f3fff7] hover:bg-[#25D366] hover:border-[#25D366]',
                      Telegram:
                        'text-[#229ED9] border-[#d7eef9] bg-[#f3fbff] hover:bg-[#229ED9] hover:border-[#229ED9]',
                      Twitter:
                        'text-[#111827] border-[#e2e5e9] bg-[#f8fafc] hover:bg-[#111827] hover:border-[#111827]',
                      LinkedIn:
                        'text-[#0A66C2] border-[#d9eaff] bg-[#f3f8ff] hover:bg-[#0A66C2] hover:border-[#0A66C2]',
                    }

                    const iconStyle =
                      socialStyles[socialItem.name] ||
                      'text-[#087f73] border-[#cfe5e1] bg-[#f3fbf9] hover:bg-[#087f73] hover:border-[#087f73]'

                    return (
                      <a
                        key={socialItem.name}
                        href={socialItem.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${socialItem.name}`}
                        title={socialItem.name}
                        className={`group flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:text-white hover:shadow-lg ${iconStyle}`}
                      >
                        <Icon
                          size={21}
                          weight="fill"
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                      </a>
                    )
                  })}
                </div>

                {/* Social names */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {socialLinks.map((socialItem) => (
                    <span
                      key={`${socialItem.name}-label`}
                      className="text-[11px] font-medium text-[#718083]"
                    >
                      {socialItem.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#172326]">
              Quick Links
            </h3>

            <nav className="mt-4 space-y-2.5">
              {[
                {
                  label: 'Home',
                  href: '/',
                },
                {
                  label: 'Latest Posts',
                  href: '/posts',
                },
                {
                  label: 'Categories',
                  href: '/categories',
                },
                {
                  label: 'Prize Bonds',
                  href: '/prize-bonds',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex w-fit items-center gap-1.5 text-sm font-bold text-[#657578] transition-colors duration-200 hover:text-[#0f8f83]"
                >
                  {item.label}

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* INFORMATION */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#172326]">
              Information
            </h3>

            <nav className="mt-4 space-y-2.5">
              {[
                {
                  label: 'About Us',
                  href: '/about-us',
                },
                {
                  label: 'Privacy Policy',
                  href: '/privacy-policy',
                },
                {
                  label: 'Disclaimer',
                  href: '/disclaimer',
                },
                {
                  label: 'Contact Us',
                  href: '/contact',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex w-fit items-center gap-1.5 text-sm font-bold text-[#657578] transition-colors duration-200 hover:text-[#0f8f83]"
                >
                  {item.label}

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#dceae7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#748482]">
            © {currentYear}{' '}
            <Link
              href="/"
              className="font-semibold text-[#405250] transition-colors hover:text-[#087f73] hover:underline"
            >
              {siteName}
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
