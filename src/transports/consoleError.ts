import Transport from 'winston-transport';
import winston from 'winston';
import { format } from '../format';

interface ConsoleErrorTransportOptions {
  errorLevel?: string;
}

export class ConsoleErrorTransport extends Transport {
  readonly format = winston.format.combine(
    winston.format.errors(),
    winston.format.colorize(),
    format.timestamp(),
    winston.format.align(),
    winston.format.simple(),
  );

  private readonly errorLevel: string;

  constructor(opts: ConsoleErrorTransportOptions) {
    super({ silent: false, handleExceptions: true });

    this.errorLevel = opts.errorLevel || 'error';
  }

  log(info: any, callback?: (err: Error | undefined) => void): any {
    info.level = this.errorLevel;
    info[Symbol.for('level')] = this.errorLevel;
    this.format.transform(info, {});
    console.log(`${info.level}: ${info.message}`);

    callback?.(undefined); //重要! 不可不執行 callback
    this.emit('logged', info);
    return true;
  }
}
