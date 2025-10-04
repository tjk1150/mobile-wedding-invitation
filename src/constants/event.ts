// Read from NEXT_PUBLIC_ so it is available on the client
const ENV_VALUE = process.env.NEXT_PUBLIC_EVENT_DATETIME_ISO;

// Fallback to a sensible default if env is missing (useful for previews)
export const EVENT_DATETIME_ISO =
  (ENV_VALUE && ENV_VALUE.trim()) || '2026-02-28T14:30:00+09:00';
