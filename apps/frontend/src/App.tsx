import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/app-header'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Placeholder title="Book" />} />
            <Route path="/manage" element={<Placeholder title="Manage" />} />
            <Route path="/admin" element={<Placeholder title="Staff" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
