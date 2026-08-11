import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui/button'
import { card } from '../lib/ui'
import { cn } from '../lib/utils'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AppErrorBoundary', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg px-3 py-16 sm:px-6">
          <div className={cn(card, 'px-5 py-8 text-center')}>
            <p className="text-sm font-medium tracking-tight text-destructive">
              Something went wrong
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              The page hit an unexpected error. Reload to continue.
            </p>
            <Button
              type="button"
              size="sm"
              className="mt-4 shadow-md"
              onClick={() => window.location.assign('/')}
            >
              Reload app
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
