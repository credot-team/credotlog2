"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npm = void 0;
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',
};
/**
 * The logging levels that npm use.
 *
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
exports.npm = {
    levels: levels,
    colors: colors,
};
