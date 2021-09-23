"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syslog = void 0;
const levels = {
    notice: 5,
    emerg: 0,
    alert: 1,
    warning: 4,
    err: 3,
    debug: 7,
    crit: 2,
    info: 6,
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
exports.syslog = {
    levels: levels,
    colors: colors,
};
