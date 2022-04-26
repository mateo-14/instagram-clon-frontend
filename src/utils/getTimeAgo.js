const DATE_UNITS = {
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

const getSecondsDiff = (timestamp) => (Date.now() - timestamp) / 1000;
const getUnitAndValueDate = (secondsElapsed) => {
  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (secondsElapsed >= secondsInUnit || unit === 'second') {
      const value = Math.min(0, Math.floor(secondsElapsed / secondsInUnit) * -1);
      return { value, unit };
    }
  }
};

const getTimeAgo = (timestamp) => {
  const rtf = new Intl.RelativeTimeFormat();

  const secondsElapsed = getSecondsDiff(timestamp);
  const { value, unit } = getUnitAndValueDate(secondsElapsed);
  return rtf.format(value, unit);
};

const getShortTimeAgo = (timestamp) => {
  const secondsElapsed = getSecondsDiff(timestamp);
  const { value, unit } = getUnitAndValueDate(secondsElapsed);
  return `${value * -1}${unit[0]}`;
};

export { getTimeAgo, getShortTimeAgo };
// Source https://midu.dev/como-crear-un-time-ago-sin-dependencias-intl-relativeformat/
