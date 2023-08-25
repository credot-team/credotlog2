"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraylogTransport = void 0;
const winston_transport_1 = __importDefault(require("winston-transport"));
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
const logLevels_1 = require("../logLevels");
const url_1 = require("url");
const axios_1 = __importDefault(require("axios"));
/* TODO: try to migrate to got since it's a http request package which targets nodejs
  migrate guide: https://github.com/sindresorhus/got/blob/main/documentation/migration-guides/axios.md
 */
const axiosInstance = axios_1.default.create();
class GraylogTransport extends winston_transport_1.default {
    constructor(opts) {
        var _a;
        super(opts);
        this.silent = (_a = opts.silent) !== null && _a !== void 0 ? _a : false;
        const server = opts.graylog.server;
        const gelfUrl = new url_1.URL(server.host);
        if (server.port)
            gelfUrl.port = server.port.toString();
        gelfUrl.pathname = GraylogTransport.API_PATH;
        this.gelfUrl = gelfUrl.toString();
        this.hostname = opts.graylog.hostname;
        this.staticMeta = opts.staticMeta;
        this.levelNumberMapping = {};
        Object.entries(opts.levelMap).forEach(([name, alias]) => {
            this.levelNumberMapping[alias] = logLevels_1.syslog.levels[name];
        });
    }
    log(info, callback) {
        const _a = info, { message, level, metadata } = _a, restInfo = __rest(_a, ["message", "level", "metadata"]);
        const additionFields = {};
        Object.entries(Object.assign(Object.assign(Object.assign({}, this.staticMeta), metadata), restInfo)).forEach(([key, value]) => {
            if (GraylogTransport.OVERRIDEABLE_PAYLOAD.includes(key)) {
                additionFields[key] = value;
                return;
            }
            if (!additionFields._data)
                additionFields._data = {};
            additionFields._data[key] = value;
        });
        let eol = message.indexOf('\n'); //end of line
        const firstLine = eol >= 0 ? message.slice(0, eol) : message;
        const shortMessage = firstLine.length > 100 ? firstLine.slice(0, 100) : firstLine;
        const payload = Object.assign({ version: GraylogTransport.VERSION, timestamp: Math.trunc(Date.now() * 1e-3), level: this.levelNumberMapping[level], host: this.hostname, short_message: shortMessage, full_message: message }, additionFields);
        axiosInstance
            .post(this.gelfUrl, payload, { timeout: 1000 })
            .then((result) => {
            if (result.status !== 202)
                throw new Error(`response status: ${result.status};`);
            this.emit('logged', info);
            callback === null || callback === void 0 ? void 0 : callback(undefined);
        })
            .catch((e) => {
            const error = new Error(`send graylog failed: ${e.message}; payload: ${(0, safe_stable_stringify_1.default)(payload)};`);
            this.emit('warn', error);
            callback === null || callback === void 0 ? void 0 : callback(undefined);
        });
        return true;
    }
}
exports.GraylogTransport = GraylogTransport;
GraylogTransport.VERSION = '1.1';
GraylogTransport.API_PATH = 'gelf';
GraylogTransport.OVERRIDEABLE_PAYLOAD = ['full_message', 'short_message'];
