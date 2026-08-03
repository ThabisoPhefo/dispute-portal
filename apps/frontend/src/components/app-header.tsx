import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const NAV = [
  { href: '/', label: 'Transactions' },
  { href: '/manage', label: 'Disputes' },
  { href: '/admin', label: 'Staff' },
]

export function AppHeader() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-border/60 bg-card/80 px-3 py-2.5 shadow-lg backdrop-blur-md sm:gap-6 sm:px-5">
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
                  'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  active
                    ? 'bg-foreground text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
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
