"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const logger = __1.default.create({
    consoleLogLevel: 'info',
    maxSize: '100m',
    maxDay: 14,
    graylog: {
        level: 'err',
        server: { host: 'https://graylog.credot.ml/', port: 1234 },
        hostname: 'credotlog-test',
    },
    exceptionLevel: 'debug',
    filenameDateFormat: 'YYYYMMDDHH'
});
__1.default.addLevelFontStyles({
    error: 'bold red yellowBG',
    info: 'blue',
    debug: 'whiteBG black',
});
logger.info('asd');
logger.err('hello world', {
    _data: 'dust',
    trace: { a: 1, b: 5 },
    short_message: 'hidden message',
});
