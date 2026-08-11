export const microLabel =
  'text-[10px] font-medium uppercase tracking-wider text-muted-foreground'

export const eyebrowPill =
  'rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground'

export const card = 'rounded-xl bg-card shadow-md'

export const formControl =
  'w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs outline-none transition-all duration-200 focus:border-foreground/30 focus:bg-card focus:ring-2 focus:ring-ring/20'

export const formError =
  'rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive'

export const sectionTitle = 'text-sm font-bold tracking-tight'

export const sectionLead = 'mt-1 text-xs leading-relaxed text-muted-foreground'

export const pageShellNarrow = 'mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-12'

export const loadingState = 'flex items-center justify-center text-muted-foreground'

export const selectableCard = {
  base: 'cursor-pointer rounded-xl bg-card p-4 text-left shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
  selected: 'shadow-xl border border-foreground/30 ring-1 ring-foreground/10',
  idle: 'border border-transparent',
} as const
