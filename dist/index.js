"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.levellog = exports.colorlog = exports.log = exports.init = void 0;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
let graylogURL = '';
let host = '';
/**
 * @param {string} protocol http/https
 * @param {string} urlHost 網址
 * @param {string} serviceName graylog的source
 */
const init = (protocol, urlHost, serviceName) => {
    const url = new URL('http://w');
    url.protocol = protocol;
    url.host = urlHost;
    url.pathname = 'gelf';
    graylogURL = url.toString();
    host = serviceName;
    exports.colorlog(`graylog init: ${JSON.stringify({ graylogURL, source: host })}`, 'info');
};
exports.init = init;
// https://en.wikipedia.org/wiki/Syslog#cite_note-opengroupSyslog-8
const levelMap = new Map();
levelMap.set('Emerg', 0); // A panic condition.
levelMap.set('Alert', 1); // A condition that should be corrected immediately, such as a corrupted system database.
levelMap.set('Crit', 2); // Hard device errors.
levelMap.set('Err', 3);
levelMap.set('Warning', 4);
levelMap.set('Notice', 5); // Conditions that are not error conditions, but that may require special handling.
levelMap.set('Info', 6);
levelMap.set('Debug', 7); // only when debugging a program.
/**
 * @param {string} level 等級
 * @param {string} message
 * @param {object} others 其他設定
 * @returns {Promise<void>}
 */
const log = (level, message, others) => __awaiter(void 0, void 0, void 0, function* () {
    let l = levelMap.get(level);
    exports.levellog(`${message} ${JSON.stringify(others)}`, l);
    let body = Object.assign({ host, level: l, short_message: message }, others);
    try {
        let result = yield axios_1.default.post(graylogURL, body);
        if (result.status !== 202) {
            throw new Error(`send graylog data: ${JSON.stringify(result.config.data)}`);
        }
    }
    catch (error) {
        console.log('send graylog fail, error: ', error.message);
    }
});
exports.log = log;
/**
 * 指定輸出顏色
 * @param {string} color 顏色 'black' | 'info' | 'success' | 'warning' | 'error' | 'debug'
 * @param {string} message
 */
const colorlog = (message, color = 'black') => {
    switch (color) {
        case 'success':
            console.log(chalk_1.default.greenBright(message));
            break;
        case 'info':
            console.log(chalk_1.default.cyanBright(message));
            break;
        case 'error':
            console.log(chalk_1.default.redBright(message));
            break;
        case 'warning':
            console.log(chalk_1.default.yellow(message));
            break;
        case 'debug':
            console.log(chalk_1.default.dim(message));
            break;
        default:
            console.log(message);
    }
};
exports.colorlog = colorlog;
/**
 * 指定log等級
 * @param {number} level 等級 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
 * @param {string} message
 */
const levellog = (message, level) => {
    switch (level) {
        case 7:
            console.log(chalk_1.default.magentaBright(message));
            break;
        case 6:
            console.log(chalk_1.default.dim(message));
            break;
        case 5 | 4:
            console.log(chalk_1.default.yellow(message));
            break;
        default:
            console.log(chalk_1.default.redBright(message));
            break;
    }
};
exports.levellog = levellog;
