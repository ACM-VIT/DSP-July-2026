export const FIGMA_EVENT_START_AT = '2026-06-19T16:00:00+05:30'

export function resolveEventStartAt(value?: string): string {
  const candidate = value?.trim()

  if (!candidate || Number.isNaN(Date.parse(candidate))) {
    return FIGMA_EVENT_START_AT
  }

  return candidate
}

export const eventStartAt = resolveEventStartAt(import.meta.env.VITE_EVENT_START_AT)
