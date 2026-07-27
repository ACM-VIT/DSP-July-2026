export interface CountdownParts {
  hours: number
  minutes: number
  seconds: number
  totalMilliseconds: number
}

function getTargetTime(target: string | number | Date): number {
  if (target instanceof Date) {
    return target.getTime()
  }

  if (typeof target === 'number') {
    return target
  }

  return Date.parse(target)
}

export function getCountdownParts(
  target: string | number | Date,
  now = Date.now(),
): CountdownParts {
  const targetTime = getTargetTime(target)
  const totalMilliseconds = Number.isFinite(targetTime) ? Math.max(0, targetTime - now) : 0
  const totalSeconds = Math.floor(totalMilliseconds / 1000)

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMilliseconds,
  }
}
