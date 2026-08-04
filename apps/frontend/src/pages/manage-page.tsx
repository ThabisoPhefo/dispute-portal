import { ManagePanel } from '../components/manage/manage-panel'

export function ManagePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Your disputes</h1>
      <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
        Browse your claim history from newest to oldest, or look up a reference. Try{' '}
        <span className="font-semibold tabular-nums text-foreground">DP-2026-0417</span> for a demo.
      </p>
      <div className="mt-6">
        <ManagePanel />
      </div>
    </div>
  )
}
