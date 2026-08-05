import type { DisputeStatus } from '@dispute-portal/shared-types'

export function getStatusLabel(status: DisputeStatus): string {
  switch (status) {
    case 'CANCELLED':    return 'Cancelled'
    case 'UNDER_REVIEW': return 'Under review'
    case 'APPROVED':     return 'Approved'
    case 'REJECTED':     return 'Rejected'
    default:             return 'Open'
  }
}
