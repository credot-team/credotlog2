import { syslog as _syslog } from './syslog';
import { npm as _npm } from './npm';
import winston from 'winston';

winston.addColors(_syslog.colors);
winston.addColors(_npm.colors);

export type LogLevels = { [key: string]: number };
export type LevelDefinition<T> = { levels: T; colors: any };
export type DefaultLogLevels = typeof Default.levels;

export const Default = _syslog;

export const syslog = _syslog;

/**
 * Alias for syslog
 * @see syslog
 */
export const rfc5424 = _syslog;

export const npm = _npm;
