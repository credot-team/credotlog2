/// <reference types="node" />
import winston from 'winston';
import { LogLevels } from '../logLevels';
import { RequiredLevels } from './options';
import EventEmitter from 'events';
declare type LeveledLogMethod = (message: string, others?: object) => void;
export declare type Logger<Levels extends LogLevels> = DivideLogger<Levels> & {
    [P in keyof Levels]: LeveledLogMethod;
};
export declare class DivideLogger<Levels extends LogLevels> {
    private readonly baseLogger;
    private readonly subLogger;
    private readonly emitter;
    constructor(logger: winston.Logger, subLogger: winston.Logger, levelMapping: Record<RequiredLevels, string>);
    private fireLogEvent;
    on(event: 'warn', listener: (err: Error | unknown) => void): Logger<Levels>;
    on(event: 'error', listener: (err: Error) => void): Logger<Levels>;
    on(event: 'log', listener: (level: string | undefined, info: any) => void): Logger<Levels>;
    on(event: string | symbol, listener: (...args: any[]) => void): Logger<Levels>;
    off(...args: Parameters<EventEmitter['off']>): Logger<Levels>;
    log(level: keyof Levels, message: string, others?: object): void;
    levels(): Levels;
}
export {};
