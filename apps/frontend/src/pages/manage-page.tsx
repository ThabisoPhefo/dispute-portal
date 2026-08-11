import { ManagePanel } from '../components/manage/manage-panel'
import { pageShellNarrow } from '../lib/ui'

export function ManagePage() {
  return (
    <div className={pageShellNarrow}>
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
