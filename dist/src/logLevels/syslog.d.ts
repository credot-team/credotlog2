import { LevelDefinition } from './index';
/**
 * Reference to RFC5424.
 *
 * emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7
 *
 * Links:
 * - [RFC 5424]{@link https://datatracker.ietf.org/doc/html/rfc5424}
 * - [wikipedia]{@link https://en.wikipedia.org/wiki/Syslog}
 */
export declare const syslog: LevelDefinition<{
    notice: number;
    emerg: number;
    alert: number;
    warning: number;
    err: number;
    debug: number;
    crit: number;
    info: number;
}>;
