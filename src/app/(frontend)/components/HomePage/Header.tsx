import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'

import MobileNav from './MobileNav'

interface HeaderProps {
  siteSettings: any
}

export default function Header({ siteSettings }: HeaderProps) {
  const siteName = siteSettings?.siteName || siteSettings?.name || 'HamariInfo'

  const logo = typeof siteSettings?.logo === 'object' ? siteSettings.logo : null

  return (
    <header className="sticky top-0 z-50 border-b border-[#385945] bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* MAIN HEADER */}
        <div className="flex h-18 items-center">
          {/* LOGO */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label={`${siteName} home`}
          >
            {logo?.url ? (
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                <Image
                  src={logo.url}
                  alt={logo.alt || siteName}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#087f73] text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                PF
              </span>
            )}

            <span className="text-[17px] font-bold tracking-[-0.02em] text-[#172326] sm:text-lg">
              {siteName}
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="ml-8 hidden items-center gap-1.5 md:flex lg:ml-12"
          >
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#087f73] transition-colors hover:bg-[#e8f7f3]"
            >
              Home
            </Link>

            <Link
              href="/posts"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#46565a] transition-colors hover:bg-[#e8f7f3] hover:text-[#087f73]"
            >
              Posts
            </Link>

            <Link
              href="/categories"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#46565a] transition-colors hover:bg-[#e8f7f3] hover:text-[#087f73]"
            >
              Categories
            </Link>

            <Link
              href="/prize-bonds"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#46565a] transition-colors hover:bg-[#e8f7f3] hover:text-[#087f73]"
            >
              Prize Bonds
            </Link>
          </nav>

          {/* SEARCH */}
          <form action="/search" className="ml-auto hidden w-full max-w-70 md:block">
            <label htmlFor="header-search" className="sr-only">
              Search finance news
            </label>

            <div className="group relative">
              <MagnifyingGlass
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718083] group-focus-within:text-[#087f73]"
              />

              <input
                id="header-search"
                name="q"
                type="search"
                placeholder="Search finance news..."
                className="h-10 w-full rounded-xl border border-[#dce9e5] bg-[#f8faf9] pl-9 pr-3 text-sm text-[#172326] outline-none transition-all placeholder:text-[#8a989a] focus:border-[#087f73] focus:bg-white focus:ring-2 focus:ring-[#087f73]/10"
              />
            </div>
          </form>

          {/* MOBILE MENU */}
          <div className="ml-auto md:hidden">
            <MobileNav />
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="pb-3 md:hidden">
          <form action="/search">
            <label htmlFor="mobile-header-search" className="sr-only">
              Search finance news
            </label>

            <div className="relative">
              <MagnifyingGlass
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718083]"
              />

              <input
                id="mobile-header-search"
                name="q"
                type="search"
                placeholder="Search finance news..."
                className="h-10 w-full rounded-xl border border-[#dce9e5] bg-[#f8faf9] pl-9 pr-3 text-sm text-[#172326] outline-none placeholder:text-[#8a989a] focus:border-[#087f73] focus:bg-white focus:ring-2 focus:ring-[#087f73]/10"
              />
            </div>
          </form>
        </div>
      </div>

      {/* ACCENT */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#087f73]/25 to-transparent" />
    </header>
  )
}
