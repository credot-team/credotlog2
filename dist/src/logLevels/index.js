"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npm = exports.rfc5424 = exports.syslog = exports.Default = void 0;
const syslog_1 = require("./syslog");
const npm_1 = require("./npm");
const winston_1 = __importDefault(require("winston"));
winston_1.default.addColors(syslog_1.syslog.colors);
winston_1.default.addColors(npm_1.npm.colors);
exports.Default = syslog_1.syslog;
exports.syslog = syslog_1.syslog;
/**
 * Alias for syslog
 * @see syslog
 */
exports.rfc5424 = syslog_1.syslog;
exports.npm = npm_1.npm;
