/** Shared style tokens reused across the dispute/manage UI. */
export const microLabel = 'text-[10px] font-medium uppercase tracking-wider text-muted-foreground'

export const card = 'rounded-xl bg-card shadow-md'

export const selectableCard = {
  base: 'cursor-pointer rounded-xl bg-card p-4 text-left shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
  selected: 'shadow-xl border border-foreground/30 ring-1 ring-foreground/10',
  idle: 'border border-transparent',
} as const
