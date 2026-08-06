import { describe, expect, it } from 'vitest'
import { getStatusLabel } from './dispute-utils'

describe('getStatusLabel', () => {
  it('maps each status to its display label', () => {
    expect(getStatusLabel('OPEN')).toBe('Open')
    expect(getStatusLabel('UNDER_REVIEW')).toBe('Under review')
    expect(getStatusLabel('APPROVED')).toBe('Approved')
    expect(getStatusLabel('REJECTED')).toBe('Rejected')
    expect(getStatusLabel('CANCELLED')).toBe('Cancelled')
  })
})
