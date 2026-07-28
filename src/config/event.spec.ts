import { describe, expect, it } from 'vitest'
import {
  DEFAULT_EVENT_END_AT,
  DEFAULT_EVENT_PLATFORM,
  DEFAULT_EVENT_START_AT,
  DEFAULT_EVENT_TIME_ZONE,
  resolveEventConfig,
} from './event'

describe('resolveEventConfig', () => {
  it('uses configured event values and derives the visible labels', () => {
    expect(
      resolveEventConfig({
        VITE_EVENT_START_AT: '2030-01-01T12:00:00+05:30',
        VITE_EVENT_END_AT: '2030-01-01T13:30:00+05:30',
        VITE_EVENT_TIME_ZONE: 'Asia/Kolkata',
        VITE_EVENT_PLATFORM: 'Microsoft Teams',
      }),
    ).toEqual({
      startAt: '2030-01-01T12:00:00+05:30',
      endAt: '2030-01-01T13:30:00+05:30',
      timeZone: 'Asia/Kolkata',
      platform: 'Microsoft Teams',
      dateLabel: '1 January, 2030',
      timeLabel: '12:00 PM - 1:30 PM',
    })
  })

  it('falls back when environment values are absent or invalid', () => {
    expect(
      resolveEventConfig({
        VITE_EVENT_START_AT: 'not-a-date',
        VITE_EVENT_END_AT: 'also-not-a-date',
        VITE_EVENT_TIME_ZONE: 'not/a-time-zone',
        VITE_EVENT_PLATFORM: ' ',
      }),
    ).toEqual({
      startAt: DEFAULT_EVENT_START_AT,
      endAt: DEFAULT_EVENT_END_AT,
      timeZone: DEFAULT_EVENT_TIME_ZONE,
      platform: DEFAULT_EVENT_PLATFORM,
      dateLabel: '30 July, 2026',
      timeLabel: '8:30 PM - 9:30 PM',
    })
  })

  it('defaults the end to one hour after a configured start', () => {
    expect(
      resolveEventConfig({
        VITE_EVENT_START_AT: '2030-01-01T12:00:00+05:30',
      }).timeLabel,
    ).toBe('12:00 PM - 1:00 PM')
  })
})
