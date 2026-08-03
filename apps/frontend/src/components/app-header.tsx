import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const NAV = [
  { href: '/', label: 'Transactions' },
  { href: '/manage', label: 'Disputes' },
  { href: '/admin', label: 'Staff' },
]

export function AppHeader() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 pb-3 sm:px-6">
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 sm:gap-8 sm:px-6',
          'border border-white/50 bg-white/45 shadow-[0_8px_32px_rgb(18_33_59/0.08)]',
          'backdrop-blur-md backdrop-saturate-150',
          'supports-backdrop-filter:bg-white/35',
          scrolled &&
            'bg-white/55 shadow-[0_8px_32px_rgb(18_33_59/0.12)] supports-backdrop-filter:bg-white/40',
        )}
      >
        <Link
          to="/"
          aria-label="Capitec home"
          className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-70"
        >
          <span className="relative block h-5 w-29 overflow-hidden sm:h-5.5 sm:w-33">
            <img
              src="/capitec-logo.png"
              alt="Capitec"
              width={550}
              height={550}
              className="absolute left-1/2 top-1/2 h-[340%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'cursor-pointer rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 sm:px-4',
                  active
                    ? 'bg-foreground text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-white/50 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
