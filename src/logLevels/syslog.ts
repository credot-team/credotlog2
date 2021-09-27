import { LevelDefinition } from './index';

const levels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  err: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

const colors = {
  emerg: 'red',
  alert: 'yellow',
  crit: 'red',
  err: 'red',
  warning: 'red',
  notice: 'yellow',
  info: 'green',
  debug: 'blue',
};

/**
 * Reference to RFC5424.
 *
 * emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7
 *
 * Links:
 * - [RFC 5424]{@link https://datatracker.ietf.org/doc/html/rfc5424}
 * - [wikipedia]{@link https://en.wikipedia.org/wiki/Syslog}
 */
export const syslog = {
  levels: levels,
  colors: colors,
} as LevelDefinition<typeof levels>;
