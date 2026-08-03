import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const NAV = [
  { href: '/', label: 'Book' },
  { href: '/manage', label: 'Manage' },
  { href: '/admin', label: 'Staff' },
]

export function AppHeader() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-border/60 bg-card/80 px-3 py-2.5 shadow-lg backdrop-blur-md sm:gap-6 sm:px-5">
        <Link to="/" className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-70">
          <img
            src="/capitec-logo.png"
            alt="Capitec"
            width={440}
            height={80}
            className="h-4 w-auto sm:h-[18px]"
          />
          <span className="sr-only">Capitec home</span>
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
