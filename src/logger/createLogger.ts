import winston from 'winston';
import 'winston-daily-rotate-file';
import { DefaultLevelMapping, LogOptions } from './options';
import { Default as DefaultLevel, DefaultLogLevels, LogLevels } from '../logLevels';
import { ConsoleErrorTransport, GraylogTransport } from '../transports';
import { DivideLogger, Logger } from './logger';
import { format } from '../format';

const defaultLogLevels = DefaultLevel.levels;

/**
 * 在檔名與附檔名之間插入時間信息
 * @param filePath 檔案路徑
 */
function insertFilenameDate(filePath: string): string {
  const parts = filePath.split('.');
  return [...parts.slice(0, -1), '%DATE%', parts.slice(-1)].join('.');
}

function generateTransports<T extends LogLevels>(options: LogOptions<T>, levels: LogLevels) {
  const transports = [];
  const handleExceptions = !!options.exceptionLevel;
  const levelMapping = { ...DefaultLevelMapping, ...options.levelMapping };

  if (options.consoleLogLevel) {
    transports.push(
      new winston.transports.Console({
        level: options.consoleLogLevel,
        format: winston.format.combine(
          winston.format.colorize({}),
          format.timestamp(),
          // winston.format.align(),
          winston.format.simple(),
        ),
      }),
    );
  }

  if (!(options.debugOut || options.infoOut || options.errorOut || options.graylog))
    return transports;

  const dateFormat = options.filenameDateFormat || 'MMDD';
  const maxDay = options.maxDay ? `${options.maxDay}d` : undefined;
  const formatter = winston.format.combine(
    format.errors(),
    format.timestamp(),
    // winston.format.align(),
    winston.format.simple(),
  );

  if (options.debugOut) {
    transports.push(
      new winston.transports.DailyRotateFile({
        auditFile: undefined,
        level: levelMapping.debug,
        format: formatter,
        filename: insertFilenameDate(options.debugOut),
        datePattern: dateFormat,
        zippedArchive: true,
        maxSize: options.maxSize,
        maxFiles: maxDay,
      }),
    );
  }

  if (options.infoOut) {
    transports.push(
      new winston.transports.DailyRotateFile({
        auditFile: undefined,
        level: levelMapping.info,
        format: formatter,
        filename: insertFilenameDate(options.infoOut),
        datePattern: dateFormat,
        zippedArchive: true,
        maxSize: options.maxSize,
        maxFiles: maxDay,
      }),
    );
  }

  if (options.errorOut) {
    transports.push(
      new winston.transports.DailyRotateFile({
        auditFile: undefined,
        handleExceptions: handleExceptions,
        level: levelMapping.err,
        format: formatter,
        filename: insertFilenameDate(options.errorOut),
        datePattern: dateFormat,
        zippedArchive: true,
        maxSize: options.maxSize,
        maxFiles: maxDay,
      }),
    );
  }

  if (options.graylog) {
    transports.push(
      new GraylogTransport({
        level: options.graylog.level,
        handleExceptions: handleExceptions,
        format: winston.format.combine(format.errors(), winston.format.simple()),
        levels: levels,
        levelMap: levelMapping,
        graylog: {
          server: {
            host: options.graylog.server.host,
            port: options.graylog.server.port,
          },
          hostname: options.graylog.hostname,
        },
      }),
    );
  }

  return transports;
}

export function create(options: LogOptions<DefaultLogLevels>): Logger<DefaultLogLevels>;
export function create<T extends LogLevels>(options: LogOptions<T>, levels: T): Logger<T>;
/**
 * 建立新 logger
 * @param options 設定
 * @param levels 設定 logger 使用的訊息等級 (預設為 syslog (RFC5424) )
 */
export function create<T extends LogLevels>(options: LogOptions<T>, levels?: T) {
  const exceptionLevel = options.exceptionLevel;
  const handleExceptions = !!exceptionLevel;
  const _levels: any = { ...(levels ?? defaultLogLevels) };

  // winston 紀錄 exception 時固定使用 level: 'error'
  if (handleExceptions && !('error' in _levels) && exceptionLevel !== 'error') {
    _levels['error'] = _levels[exceptionLevel];
  }

  const _options = {
    ...options,
    levelMapping: { ...DefaultLevelMapping, ...options.levelMapping },
  };

  const baseLogger = winston.createLogger({
    silent: false,
    levels: _levels,
    transports: generateTransports(_options, _levels),
    exitOnError: false,
  });

  const lowestLevel = Object.entries(_levels)
    .sort(([aKey, aVal], [bKey, bVal]) => {
      return (aVal as number) - (bVal as number);
    })
    .pop()![0];

  const subLogger = winston.createLogger({
    silent: false,
    levels: _levels,
    transports: generateTransports(
      {
        consoleLogLevel: lowestLevel,
        errorOut: _options.errorOut,
        levelMapping: {
          debug: lowestLevel,
          info: lowestLevel,
          warning: lowestLevel,
          err: lowestLevel,
        },
        maxSize: _options.maxSize,
        maxDay: _options.maxDay,
        filenameDateFormat: _options.filenameDateFormat,
      },
      _levels,
    ),
    exitOnError: false,
  });

  if (handleExceptions) {
    baseLogger.exceptions.handle(new ConsoleErrorTransport({ errorLevel: exceptionLevel }));
  }

  return new DivideLogger(baseLogger, subLogger, _options.levelMapping) as any;
}
