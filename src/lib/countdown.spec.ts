import { describe, expect, it } from 'vitest'
import { getCountdownParts } from './countdown'

describe('getCountdownParts', () => {
  it('returns total hours and minute/second remainders', () => {
    const now = Date.parse('2026-01-01T00:00:00.000Z')
    const target = Date.parse('2026-01-06T02:03:04.000Z')

    expect(getCountdownParts(target, now)).toEqual({
      hours: 122,
      minutes: 3,
      seconds: 4,
      totalMilliseconds: 439_384_000,
    })
  })

  it('returns zero for invalid or expired targets', () => {
    const zero = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMilliseconds: 0,
    }

    expect(getCountdownParts('invalid', 0)).toEqual(zero)
    expect(getCountdownParts(1_000, 2_000)).toEqual(zero)
  })
})
