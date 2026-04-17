import { useState, useEffect } from 'react';

const SESSIONS_TIMEZONES = {
  Sydney: ['Australia/Sydney', 7],
  Tokyo: ['Asia/Tokyo', 9],
  London: ['Europe/London', 8],
  'New York': ['America/New_York', 8],
};

/**
 * Get the current UTC offset (in hours) for an IANA timezone, accounting for DST.
 */
function getIANAOffset(ianaZone) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(now);
  const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value || '';
  const match = tzPart.match(/GMT([+-]?\d+)?(?::(\d+))?/);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours + (hours < 0 ? -minutes : minutes) / 60;
}

function addHoursToUTC(hoursToAdd) {
  const dt = new Date();
  dt.setTime(dt.getTime() + hoursToAdd * 60 * 60 * 1000);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = days[dt.getUTCDay()];
  const month = months[dt.getUTCMonth()];
  const day = dt.getUTCDate();
  const hour = dt.getUTCHours();
  const minutes = dt.getUTCMinutes();

  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';

  return { dayOfWeek, month: `${month}.`, date: `${day}${suffix}`, hour24: hour, minutes };
}

function formatHour(h24) {
  let h = h24;
  let ampm = 'AM';
  if (h === 24) { h = 12; ampm = 'AM'; }
  else if (h === 0) { h = 12; ampm = 'AM'; }
  else if (h === 12) { ampm = 'PM'; }
  else if (h > 12) { h -= 12; ampm = 'PM'; }
  return { hour: String(h).padStart(2, '0'), ampm };
}

export function useTime(offset) {
  // Resolve IANA timezone string to numeric offset once per change
  const resolvedOffset = typeof offset === 'string' ? getIANAOffset(offset) : offset;
  const [time, setTime] = useState(() => getTime(resolvedOffset));

  useEffect(() => {
    const id = setInterval(() => setTime(getTime(resolvedOffset)), 1000);
    return () => clearInterval(id);
  }, [resolvedOffset]);

  return time;
}

function getTime(utcOffset) {
  const now = new Date();
  const info = addHoursToUTC(utcOffset);
  const { hour, ampm } = formatHour(info.hour24);
  const m = String(info.minutes).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');

  // Analog hand degrees
  const secDeg = (now.getUTCSeconds() / 60) * 360;
  const minDeg = (info.minutes / 60) * 360;
  const hourDeg = ((info.hour24 + info.minutes / 60) / 12) * 360;

  return {
    hour,
    minutes: m,
    seconds: s,
    ampm,
    dayOfWeek: info.dayOfWeek,
    month: info.month,
    date: info.date,
    hour24: info.hour24,
    secDeg,
    minDeg,
    hourDeg,
  };
}

export function isSessionOpen(sessionName) {
  const [ianaZone, openHour] = SESSIONS_TIMEZONES[sessionName];
  const tz = getIANAOffset(ianaZone);

  const dt = new Date();
  dt.setUTCHours(dt.getUTCHours() + tz);
  const day = dt.getUTCDay(); // 0=Sun, 6=Sat
  const month = dt.getUTCMonth(); // 0-based
  const date = dt.getUTCDate();

  // Closed on weekends
  if (day === 0 || day === 6) return false;
  // Closed on Christmas (Dec 25) and New Year (Jan 1)
  if (month === 11 && date === 25) return false;
  if (month === 0 && date === 1) return false;

  const { hour24 } = addHoursToUTC(tz);
  const close = openHour + 8;
  return openHour <= hour24 && close >= hour24;
}

export { SESSIONS_TIMEZONES, getIANAOffset, addHoursToUTC, formatHour };
