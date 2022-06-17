"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const options_1 = require("./options");
const logLevels_1 = require("../logLevels");
const transports_1 = require("../transports");
const logger_1 = require("./logger");
const format_1 = require("../format");
const defaultLogLevels = logLevels_1.Default.levels;
/**
 * 在檔名與附檔名之間插入時間信息
 * @param filePath 檔案路徑
 */
function insertFilenameDate(filePath) {
    const parts = filePath.split('.');
    return [...parts.slice(0, -1), '%DATE%', parts.slice(-1)].join('.');
}
function generateTransports(options, levels) {
    const transports = [];
    const handleExceptions = !!options.exceptionLevel;
    const levelMapping = Object.assign(Object.assign({}, options_1.DefaultLevelMapping), options.levelMapping);
    if (options.consoleLogLevel) {
        transports.push(new winston_1.default.transports.Console({
            level: options.consoleLogLevel,
            format: winston_1.default.format.combine(winston_1.default.format.colorize({}), format_1.format.timestamp(), 
            // winston.format.align(),
            winston_1.default.format.simple()),
        }));
    }
    if (!(options.debugOut || options.infoOut || options.errorOut || options.graylog))
        return transports;
    const dateFormat = options.filenameDateFormat || 'MMDD';
    const maxDay = options.maxDay ? `${options.maxDay}d` : undefined;
    const formatter = winston_1.default.format.combine(format_1.format.errors(), format_1.format.timestamp(), 
    // winston.format.align(),
    winston_1.default.format.simple());
    if (options.debugOut) {
        transports.push(new winston_1.default.transports.DailyRotateFile({
            auditFile: undefined,
            level: levelMapping.debug,
            format: formatter,
            filename: insertFilenameDate(options.debugOut),
            datePattern: dateFormat,
            zippedArchive: true,
            maxSize: options.maxSize,
            maxFiles: maxDay,
        }));
    }
    if (options.infoOut) {
        transports.push(new winston_1.default.transports.DailyRotateFile({
            auditFile: undefined,
            level: levelMapping.info,
            format: formatter,
            filename: insertFilenameDate(options.infoOut),
            datePattern: dateFormat,
            zippedArchive: true,
            maxSize: options.maxSize,
            maxFiles: maxDay,
        }));
    }
    if (options.errorOut) {
        transports.push(new winston_1.default.transports.DailyRotateFile({
            auditFile: undefined,
            handleExceptions: handleExceptions,
            level: levelMapping.err,
            format: formatter,
            filename: insertFilenameDate(options.errorOut),
            datePattern: dateFormat,
            zippedArchive: true,
            maxSize: options.maxSize,
            maxFiles: maxDay,
        }));
    }
    if (options.graylog) {
        transports.push(new transports_1.GraylogTransport({
            level: options.graylog.level,
            handleExceptions: handleExceptions,
            format: winston_1.default.format.combine(format_1.format.errors(), winston_1.default.format.simple()),
            levels: levels,
            levelMap: levelMapping,
            graylog: {
                server: {
                    host: options.graylog.server.host,
                    port: options.graylog.server.port,
                },
                hostname: options.graylog.hostname,
            },
        }));
    }
    return transports;
}
/**
 * 建立新 logger
 * @param options 設定
 * @param levels 設定 logger 使用的訊息等級 (預設為 syslog (RFC5424) )
 */
function create(options, levels) {
    const exceptionLevel = options.exceptionLevel;
    const handleExceptions = !!exceptionLevel;
    const _levels = Object.assign({}, (levels !== null && levels !== void 0 ? levels : defaultLogLevels));
    // winston 紀錄 exception 時固定使用 level: 'error'
    if (handleExceptions && !('error' in _levels) && exceptionLevel !== 'error') {
        _levels['error'] = _levels[exceptionLevel];
    }
    const _options = Object.assign(Object.assign({}, options), { levelMapping: Object.assign(Object.assign({}, options_1.DefaultLevelMapping), options.levelMapping) });
    const baseLogger = winston_1.default.createLogger({
        silent: false,
        levels: _levels,
        transports: generateTransports(_options, _levels),
        exitOnError: false,
    });
    const lowestLevel = Object.entries(_levels)
        .sort(([aKey, aVal], [bKey, bVal]) => {
        return aVal - bVal;
    })
        .pop()[0];
    const subLogger = winston_1.default.createLogger({
        silent: false,
        levels: _levels,
        transports: generateTransports({
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
        }, _levels),
        exitOnError: false,
    });
    if (handleExceptions) {
        baseLogger.exceptions.handle(new transports_1.ConsoleErrorTransport({ errorLevel: exceptionLevel }));
    }
    return new logger_1.DivideLogger(baseLogger, subLogger, _options.levelMapping);
}
exports.create = create;
