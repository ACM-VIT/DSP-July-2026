export const DEFAULT_EVENT_START_AT = '2026-07-30T20:30:00+05:30'
export const DEFAULT_EVENT_END_AT = '2026-07-30T21:30:00+05:30'
export const DEFAULT_EVENT_TIME_ZONE = 'Asia/Kolkata'
export const DEFAULT_EVENT_PLATFORM = 'Conclave (Online)'
const DEFAULT_EVENT_DURATION_MS = 60 * 60 * 1000

function resolveTimestamp(value: string | undefined, fallback: string): string {
  const candidate = value?.trim()

  if (!candidate || Number.isNaN(Date.parse(candidate))) {
    return fallback
  }

  return candidate
}

function resolveTimeZone(value?: string): string {
  const candidate = value?.trim()

  if (!candidate) return DEFAULT_EVENT_TIME_ZONE

  try {
    new Intl.DateTimeFormat('en', { timeZone: candidate }).format()
    return candidate
  } catch {
    return DEFAULT_EVENT_TIME_ZONE
  }
}

function resolvePlatform(value?: string): string {
  return value?.trim() || DEFAULT_EVENT_PLATFORM
}

function formatEventDate(timestamp: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).formatToParts(new Date(timestamp))
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((datePart) => datePart.type === type)?.value

  return `${part('day')} ${part('month')} ${part('year')}`
}

function formatEventTime(timestamp: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(new Date(timestamp))
}

export interface EventEnvironment {
  VITE_EVENT_START_AT?: string
  VITE_EVENT_END_AT?: string
  VITE_EVENT_TIME_ZONE?: string
  VITE_EVENT_PLATFORM?: string
}

export interface EventConfig {
  startAt: string
  endAt: string
  timeZone: string
  platform: string
  dateLabel: string
  timeLabel: string
}

export function resolveEventConfig(env: EventEnvironment): EventConfig {
  const startAt = resolveTimestamp(env.VITE_EVENT_START_AT, DEFAULT_EVENT_START_AT)
  const configuredEndAt = resolveTimestamp(env.VITE_EVENT_END_AT, DEFAULT_EVENT_END_AT)
  const endAt =
    Date.parse(configuredEndAt) > Date.parse(startAt)
      ? configuredEndAt
      : new Date(Date.parse(startAt) + DEFAULT_EVENT_DURATION_MS).toISOString()
  const timeZone = resolveTimeZone(env.VITE_EVENT_TIME_ZONE)

  return {
    startAt,
    endAt,
    timeZone,
    platform: resolvePlatform(env.VITE_EVENT_PLATFORM),
    dateLabel: formatEventDate(startAt, timeZone),
    timeLabel: `${formatEventTime(startAt, timeZone)} - ${formatEventTime(endAt, timeZone)} IST`,
  }
}

export const eventConfig = resolveEventConfig({
  VITE_EVENT_START_AT: import.meta.env.VITE_EVENT_START_AT,
  VITE_EVENT_END_AT: import.meta.env.VITE_EVENT_END_AT,
  VITE_EVENT_TIME_ZONE: import.meta.env.VITE_EVENT_TIME_ZONE,
  VITE_EVENT_PLATFORM: import.meta.env.VITE_EVENT_PLATFORM,
})
