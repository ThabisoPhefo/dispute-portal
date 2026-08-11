import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown, UserRound, Users } from 'lucide-react'
import { cn } from '../lib/utils'
import { useViewMode, type ViewMode } from '../lib/use-view-mode'

const OPTIONS: {
  mode: ViewMode
  label: string
  description: string
  icon: typeof UserRound
}[] = [
  {
    mode: 'customer',
    label: 'Customer',
    description: 'Transactions & disputes',
    icon: UserRound,
  },
  {
    mode: 'staff',
    label: 'Staff',
    description: 'Operations view',
    icon: Users,
  },
]

export function ViewModeMenu() {
  const navigate = useNavigate()
  const { viewMode, setViewMode } = useViewMode()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const ActiveIcon = viewMode === 'staff' ? Users : UserRound

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function selectMode(mode: ViewMode) {
    setOpen(false)
    if (mode === viewMode) return
    setViewMode(mode)
    navigate(mode === 'staff' ? '/staff' : '/')
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={viewMode === 'staff' ? 'Staff account menu' : 'Customer account menu'}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 text-muted-foreground transition-all duration-200 sm:px-2.5 sm:py-2',
          open
            ? 'bg-foreground text-primary-foreground shadow-sm'
            : 'hover:bg-white/50 hover:text-foreground',
        )}
      >
        <ActiveIcon className="size-3.5 sm:size-4" />
        <ChevronDown
          className={cn('size-3 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Switch view"
          className="absolute right-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-border/60 bg-card p-1 shadow-lg"
        >
          {OPTIONS.map((option) => (
            <ModeOption
              key={option.mode}
              active={viewMode === option.mode}
              icon={<option.icon className="size-3.5" />}
              label={option.label}
              description={option.description}
              onSelect={() => selectMode(option.mode)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ModeOption({
  active,
  icon,
  label,
  description,
  onSelect,
}: {
  active: boolean
  icon: ReactNode
  label: string
  description: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        'flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150',
        active ? 'bg-secondary' : 'hover:bg-secondary/60',
      )}
    >
      <span className="mt-0.5 text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold tracking-tight text-foreground">{label}</span>
        <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
      {active && <Check className="mt-0.5 size-3.5 shrink-0 text-foreground" aria-hidden="true" />}
    </button>
  )
}
