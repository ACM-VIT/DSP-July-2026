import { describe, expect, it } from 'vitest'
import { FIGMA_EVENT_START_AT, resolveEventStartAt } from './event'

describe('resolveEventStartAt', () => {
  it('uses a valid configured timestamp', () => {
    expect(resolveEventStartAt('2030-01-01T12:00:00+05:30')).toBe('2030-01-01T12:00:00+05:30')
  })

  it('falls back to the Figma timestamp when the value is absent or invalid', () => {
    expect(resolveEventStartAt()).toBe(FIGMA_EVENT_START_AT)
    expect(resolveEventStartAt('not-a-date')).toBe(FIGMA_EVENT_START_AT)
  })
})
