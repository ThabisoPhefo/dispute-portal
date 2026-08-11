import { createContext } from 'react'

export type ViewMode = 'customer' | 'staff'

export const ViewModeContext = createContext<{
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
} | null>(null)
