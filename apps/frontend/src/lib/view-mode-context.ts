import { createContext } from 'react'

export type ViewMode = 'customer' | 'staff'

export type ViewModeContextValue = {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export const ViewModeContext = createContext<ViewModeContextValue | null>(null)
