import { describe, expect, it } from 'vitest'
import {
  DEFAULT_EVENT_END_AT,
  DEFAULT_EVENT_START_AT,
  DEFAULT_EVENT_TIME_ZONE,
  DEFAULT_EVENT_VENUE,
  resolveEventConfig,
} from './event'

describe('resolveEventConfig', () => {
  it('uses configured event values and derives the visible labels', () => {
    expect(
      resolveEventConfig({
        VITE_EVENT_START_AT: '2030-01-01T12:00:00+05:30',
        VITE_EVENT_END_AT: '2030-01-01T13:30:00+05:30',
        VITE_EVENT_TIME_ZONE: 'Asia/Kolkata',
        VITE_EVENT_VENUE: 'Main Auditorium',
      }),
    ).toEqual({
      startAt: '2030-01-01T12:00:00+05:30',
      endAt: '2030-01-01T13:30:00+05:30',
      timeZone: 'Asia/Kolkata',
      venue: 'Main Auditorium',
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
        VITE_EVENT_VENUE: ' ',
      }),
    ).toEqual({
      startAt: DEFAULT_EVENT_START_AT,
      endAt: DEFAULT_EVENT_END_AT,
      timeZone: DEFAULT_EVENT_TIME_ZONE,
      venue: DEFAULT_EVENT_VENUE,
      dateLabel: '19 June, 2026',
      timeLabel: '4:00 PM - 5:00 PM',
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
