import 'winston-daily-rotate-file';
import { LogOptions } from './options';
import { DefaultLogLevels, LogLevels } from '../logLevels';
import { Logger } from './logger';
export declare function create(options: LogOptions<DefaultLogLevels>): Logger<DefaultLogLevels>;
export declare function create<T extends LogLevels>(options: LogOptions<T>, levels: T): Logger<T>;
