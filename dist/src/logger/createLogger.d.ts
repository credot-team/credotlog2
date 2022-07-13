import 'winston-daily-rotate-file';
import { LogOptions } from './options';
import { LogLevels } from '../logLevels';
import { Logger } from './logger';
export declare function create(options: LogOptions): Logger;
export declare function create<T extends LogLevels>(options: LogOptions<T>, levels: T): Logger<T>;
