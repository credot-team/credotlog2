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
exports.AxiomTransport = void 0;
const winston_transport_1 = __importDefault(require("winston-transport"));
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
const logLevels_1 = require("../logLevels");
const axios_1 = __importDefault(require("axios"));
class AxiomTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
        this.instance = axios_1.default.create({
            baseURL: `https://cloud.axiom.co/api/v1/datasets/${opts.axiom.env}/ingest`,
            headers: {
                Authorization: 'Bearer ' + opts.axiom.apiToken,
                'Content-Type': 'application/x-ndjson',
            },
        });
        this.service = opts.axiom.service;
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
            if (AxiomTransport.OVERRIDEABLE_PAYLOAD.includes(key)) {
                additionFields[key] = value;
                return;
            }
            if (!additionFields._data)
                additionFields._data = {};
            additionFields._data[key] = value;
        });
        const payload = Object.assign({ service: this.service, level: level === 'err' ? 'error' : level, message }, additionFields);
        this.instance
            .post('', payload)
            .then((result) => {
            if (result.status !== 200)
                throw new Error(`response status: ${result.status};`);
            this.emit('logged', info);
            callback === null || callback === void 0 ? void 0 : callback(undefined);
        })
            .catch((e) => {
            const error = new Error(`send axiom failed: ${e.message}; payload: ${(0, safe_stable_stringify_1.default)(payload)};`);
            this.emit('warn', error);
            callback === null || callback === void 0 ? void 0 : callback(undefined);
        });
        return true;
    }
}
exports.AxiomTransport = AxiomTransport;
AxiomTransport.OVERRIDEABLE_PAYLOAD = ['full_message', 'short_message'];
