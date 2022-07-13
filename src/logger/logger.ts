import winston from 'winston';
import { LogLevels, DefaultLogLevels } from '../logLevels';
import { RequiredLevels } from './options';
import EventEmitter from 'events';

type LeveledLogMethod = (message: string, others?: object) => void;

export type Logger<Levels extends LogLevels = DefaultLogLevels> = DivideLogger<Levels> &
  {
    [P in keyof Levels]: LeveledLogMethod;
  };

export class DivideLogger<Levels extends LogLevels> {
  private readonly baseLogger: winston.Logger;
  private readonly subLogger: winston.Logger;
  private readonly emitter = new EventEmitter();

  constructor(
    logger: winston.Logger,
    subLogger: winston.Logger,
    levelMapping: Record<RequiredLevels, string>,
  ) {
    const self: any = this;

    // 產生與各 level 對應的快捷 method ( ex. this.err(), this.info() )
    Object.keys(logger.levels).forEach((k) => {
      self[k] = ((message: string, others?: object) => {
        self.log(k, message, others);
      }) as LeveledLogMethod;
    });

    this.baseLogger = logger;
    this.subLogger = subLogger;

    // TODO 考慮將下面兩個設定成可自定義
    const errorLevel = levelMapping.err;
    const warningLevel = levelMapping.warning;

    // create 'warn', 'error' events

    logger.on('warn', (err: unknown) => {
      this.emitter.emit('warn', err);
      subLogger.log(warningLevel, err instanceof Error ? err.stack : err);
    });

    logger.on('error', (err) => {
      this.emitter.emit('warn', err);
      subLogger.log(errorLevel, err.stack);
    });

    subLogger.on('error', (err) => {
      this.emitter.emit('error', err);
    });

    // create 'log' event

    logger.on('data', (chunk) => {
      this.fireLogEvent(chunk);
    });

    subLogger.on('data', (chunk) => {
      this.fireLogEvent(chunk);
    });
  }

  private fireLogEvent(info: any) {
    this.emitter.emit('log', info.level, info);
  }

  on(event: 'warn', listener: (err: Error | unknown) => void): Logger<Levels>;
  on(event: 'error', listener: (err: Error) => void): Logger<Levels>;
  on(event: 'log', listener: (level: string | undefined, info: any) => void): Logger<Levels>;
  on(event: string | symbol, listener: (...args: any[]) => void): Logger<Levels>;
  on(...args: Parameters<EventEmitter['off']>): Logger<Levels> {
    this.emitter.on(...args);
    return this as any;
  }

  off(...args: Parameters<EventEmitter['off']>): Logger<Levels> {
    this.emitter.off(...args);
    return this as any;
  }

  log(level: keyof Levels, message: string, others?: object) {
    this.baseLogger.log(level as string, message, others);
  }

  levels() {
    return this.baseLogger.levels as Levels;
  }
}
