import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { useViewMode } from '../lib/use-view-mode'
import { ViewModeMenu } from './view-mode-menu'

const CUSTOMER_NAV = [
  { to: '/', label: 'Transactions' },
  { to: '/disputes', label: 'Disputes' },
]

const STAFF_NAV = [{ to: '/staff', label: 'Staff' }]

function isActivePath(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  if (to === '/disputes') {
    return pathname.startsWith('/disputes') || pathname.startsWith('/confirmation')
  }
  return pathname.startsWith(to)
}

export function AppHeader() {
  const { pathname } = useLocation()
  const { viewMode } = useViewMode()
  const [scrolled, setScrolled] = useState(false)

  const nav = viewMode === 'staff' ? STAFF_NAV : CUSTOMER_NAV
  const homeTo = viewMode === 'staff' ? '/staff' : '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 pb-2.5 sm:px-6 sm:pt-4 sm:pb-3">
      <div
        className={cn(
          'mx-auto flex max-w-6xl min-w-0 items-center gap-2 rounded-2xl px-3 py-2.5 transition-all duration-300 sm:gap-8 sm:px-6 sm:py-3',
          'border border-white/50 bg-white/45 shadow-[0_8px_32px_rgb(18_33_59/0.08)]',
          'backdrop-blur-md backdrop-saturate-150',
          'supports-backdrop-filter:bg-white/35',
          scrolled &&
            'bg-white/55 shadow-[0_8px_32px_rgb(18_33_59/0.12)] supports-backdrop-filter:bg-white/40',
        )}
      >
        <Link
          to={homeTo}
          aria-label="Capitec home"
          className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-70"
        >
          <span className="relative block h-4.5 w-20 overflow-hidden sm:h-5.5 sm:w-33">
            <img
              src="/capitec-logo.png"
              alt="Capitec"
              width={550}
              height={550}
              className="absolute left-1/2 top-1/2 h-[340%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto flex min-w-0 items-center gap-0.5 sm:gap-1.5">
          {nav.map((item) => {
            const active = isActivePath(pathname, item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={cn(
                  'max-w-[5.25rem] truncate cursor-pointer rounded-full px-2 py-1.5 text-[10px] font-medium transition-all duration-200 sm:max-w-none sm:px-4 sm:py-2 sm:text-xs',
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

        <ViewModeMenu />
      </div>
    </header>
  )
}
