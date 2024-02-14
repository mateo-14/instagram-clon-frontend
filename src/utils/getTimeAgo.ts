const DATE_UNITS = {
  year: 31557600,
  month: 2629800,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
}

const getSecondsDiff = (timestamp: number): number => (Date.now() - timestamp) / 1000
const getUnitAndValueDate = (secondsElapsed: number): { value: number, unit: Intl.RelativeTimeFormatUnit } => {
  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (secondsElapsed >= secondsInUnit || unit === 'second') {
      const value = Math.min(-0, Math.floor(secondsElapsed / secondsInUnit) * -1)
      return { value, unit: unit as Intl.RelativeTimeFormatUnit }
    }
  }

  return { value: 0, unit: 'second' }
}

const getTimeAgo = (timestamp: number): string => {
  const rtf = new Intl.RelativeTimeFormat('en')

  const secondsElapsed = getSecondsDiff(timestamp)
  const { value, unit } = getUnitAndValueDate(secondsElapsed)
  return rtf.format(value, unit)
}

const getShortTimeAgo = (timestamp: number): string => {
  const secondsElapsed = getSecondsDiff(timestamp)
  const { value, unit } = getUnitAndValueDate(secondsElapsed)
  return `${value * -1}${unit[0]}`
}

export { getTimeAgo, getShortTimeAgo }
// Source https://midu.dev/como-crear-un-time-ago-sin-dependencias-intl-relativeformat/
