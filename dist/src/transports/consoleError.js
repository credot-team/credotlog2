"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleErrorTransport = void 0;
const winston_transport_1 = __importDefault(require("winston-transport"));
const winston_1 = __importDefault(require("winston"));
const format_1 = require("../format");
class ConsoleErrorTransport extends winston_transport_1.default {
    constructor(opts) {
        super({ silent: false, handleExceptions: true });
        this.format = winston_1.default.format.combine(winston_1.default.format.errors(), winston_1.default.format.colorize(), format_1.format.timestamp(), winston_1.default.format.align(), winston_1.default.format.simple());
        this.errorLevel = opts.errorLevel || 'error';
    }
    log(info, callback) {
        info.level = this.errorLevel;
        info[Symbol.for('level')] = this.errorLevel;
        this.format.transform(info, {});
        console.log(`${info.level}: ${info.message}`);
        callback === null || callback === void 0 ? void 0 : callback(undefined); //重要! 不可不執行 callback
        this.emit('logged', info);
        return true;
    }
}
exports.ConsoleErrorTransport = ConsoleErrorTransport;
