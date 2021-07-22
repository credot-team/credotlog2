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
const init = (protocol, urlHost, serviceName) => {
    const url = new URL('http://w');
    url.protocol = protocol;
    url.host = urlHost;
    url.pathname = 'gelf';
    graylogURL = url.toString();
    host = serviceName;
    exports.colorlog(`graylog init: ${JSON.stringify({ graylogURL, host })}`, 'info');
};
exports.init = init;
// https://en.wikipedia.org/wiki/Syslog#cite_note-opengroupSyslog-8
const levelMap = new Map();
levelMap.set('Emerg', 0);
levelMap.set('Alert', 1);
levelMap.set('Crit', 2);
levelMap.set('Err', 3);
levelMap.set('Warning', 4);
levelMap.set('Notice', 5);
levelMap.set('Info', 6);
levelMap.set('Debug', 7);
/**
 * sfslfms;dfmskdfm;sdmf
 * @param {string} level hshdhdoshdlodklds
 * @param {string} message fdsfldsl
 * @param {object} others
 * @param {property} others.host
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
