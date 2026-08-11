import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/app-header'
import { SiteFooter } from './components/site-footer'
import { HomePage } from './pages/home-page'
import { ManagePage } from './pages/manage-page'
import { AdminPage } from './pages/admin-page'
import { ConfirmationPage } from './pages/confirmation-page'
import { ViewModeProvider } from './lib/view-mode'
import { useViewMode } from './lib/use-view-mode'

function RequireView({
  mode,
  redirectTo,
  children,
}: {
  mode: 'customer' | 'staff'
  redirectTo: string
  children?: ReactNode
}) {
  const { viewMode } = useViewMode()
  if (viewMode !== mode) return <Navigate to={redirectTo} replace />
  return children ?? <Outlet />
}

function HomeRedirect() {
  const { viewMode } = useViewMode()
  return <Navigate to={viewMode === 'staff' ? '/staff' : '/'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ViewModeProvider>
        <div className="flex min-h-svh flex-col">
          <AppHeader />
          <main className="flex-1">
            <Routes>
              <Route element={<RequireView mode="customer" redirectTo="/staff" />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/disputes" element={<ManagePage />} />
                <Route path="/confirmation/:ref" element={<ConfirmationPage />} />
              </Route>

              <Route element={<RequireView mode="staff" redirectTo="/" />}>
                <Route path="/staff" element={<AdminPage />} />
              </Route>

              <Route path="/manage" element={<Navigate to="/disputes" replace />} />
              <Route path="/admin" element={<Navigate to="/staff" replace />} />
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </ViewModeProvider>
    </BrowserRouter>
  )
}
