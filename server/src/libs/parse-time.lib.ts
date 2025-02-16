const timeUnits: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
};

export function parseTime(duration: string): number {
  const match = duration.match(/^(\d+)(ms|s|m|h|d|w)$/);
  if (!match) throw new Error(`Invalid time format: ${duration}`);

  const [, value, unit] = match;
  return parseInt(value, 10) * timeUnits[unit];
}
