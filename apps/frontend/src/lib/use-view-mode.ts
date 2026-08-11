import { useContext } from 'react'
import { ViewModeContext } from './view-mode-context'

export type { ViewMode } from './view-mode-context'

export function useViewMode() {
  const ctx = useContext(ViewModeContext)
  if (!ctx) throw new Error('useViewMode must be used within ViewModeProvider')
  return ctx
}
