import { useEffect, useState, type ReactNode } from 'react'
import { ViewModeContext, type ViewMode } from './view-mode-context'

const STORAGE_KEY = 'view-mode'

function readStoredMode(): ViewMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'customer' || stored === 'staff') return stored
  } catch {
    void 0
  }
  return 'customer'
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>(readStoredMode)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, viewMode)
    } catch {
      void 0
    }
  }, [viewMode])

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}
