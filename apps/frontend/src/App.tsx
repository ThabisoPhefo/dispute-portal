import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/app-header'
import { SiteFooter } from './components/site-footer'
import { HomePage } from './pages/home-page'
import { ManagePage } from './pages/manage-page'
import { AdminPage } from './pages/admin-page'
import { ConfirmationPage } from './pages/confirmation-page'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/confirmation/:ref" element={<ConfirmationPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}
